import { ref, reactive } from "vue";
import type { UnwrapRef } from "vue";
import { ZodError, ZodSchema } from "zod";
import axios from "axios";
import type { AxiosRequestConfig, CancelTokenSource } from "axios";

interface TransformFunction<T> {
  (oldValue: T[Extract<keyof T, string>]): T[Extract<keyof T, string>];
}

type OptionalTransform<T> = Partial<Record<keyof T, TransformFunction<T>>>;

interface useFormOptions<T> {
  initialValues: T;
  validationSchema: ZodSchema<T>;
  onSubmit: (values: UnwrapRef<T>, config: AxiosRequestConfig) => Promise<void>;
  transform?: OptionalTransform<T>;
}

export const useForm = <T extends Object>(options: useFormOptions<T>) => {
  const { initialValues, validationSchema, onSubmit, transform } = options;
  const data = ref(initialValues);
  const errors = reactive({} as Record<keyof T, string | null>);
  const isSubmitting = ref<boolean>(false);
  const serverError = ref<string | undefined>(undefined);
  const currentRequestCancellation = ref<CancelTokenSource | null>(null);

  // Annulation de la requête en cours
  const cancelRequest = () => {
    if (currentRequestCancellation.value) {
      currentRequestCancellation.value.cancel("Request cancelled");
      isSubmitting.value = false;
      currentRequestCancellation.value = null;
    }
  };

  const resetErrors = () => {
    for (const key in errors) {
      (errors as any)[key] = null;
    }
  };

  const resetFields = () => {
    const emptyValues = Object.fromEntries(
      Object.keys(initialValues).map((key) => [key, ""]),
    );

    // @ts-ignore
    data.value = {
      ...emptyValues,
    };
  };

  const validateField = <K extends keyof T>(field: K) => {
    const validated = validationSchema.safeParse(data.value);
    if (!validated.success) {
      const errorValidate = validated.error.errors.find(
        (err) => err.path[0] === field,
      );
      if (errorValidate !== undefined) {
        (errors as any)[field] = errorValidate.message;
      } else {
        (errors as any)[field] = null;
      }
      return;
    } else {
      resetErrors();
    }
  };

  const applyTransforms = <T>(
    data: T,
    transformFunctions: OptionalTransform<T> | undefined,
  ): T => {
    if (!transformFunctions) {
      return data;
    }

    const transformedData = {} as T;

    for (const key in data) {
      const transformFunction = transformFunctions[key];
      const value = data[key];

      if (transformFunction) {
        transformedData[key] = transformFunction(value);
      } else {
        transformedData[key] = value;
      }
    }

    return transformedData;
  };

  const handleSubmit = async () => {
    isSubmitting.value = true;
    try {
      // Validation du formulaire entier
      validationSchema.parse(data.value);
      serverError.value = undefined;
      resetErrors();

      // Transformer les données
      // @ts-ignore
      const transformedData = applyTransforms(data.value, transform);
      // Creér le token
      const config: AxiosRequestConfig = {};
      currentRequestCancellation.value = axios.CancelToken.source();
      config.cancelToken = currentRequestCancellation.value.token;
      // Appel à la fonction de soumission du formulaire
      await onSubmit(transformedData, config);
      resetFields();
      return true;
    } catch (error: any) {
      if (error instanceof ZodError) {
        error.errors.forEach((err) => {
          (errors as any)[err.path[0]] = err.message;
        });
      } else if (axios.isCancel(error)) {
        // Gestion de l'annulation de la requête
        serverError.value = "Requête annulé";
      } else if (error.response) {
        // Erreur de réponse du serveur
        serverError.value = error.response.data?.message || "An error occurred";
      } else {
        // Autres erreurs
        serverError.value = "Une erreur réseau est survenue";
      }
    } finally {
      isSubmitting.value = false;
      // remove server error
      setTimeout(() => {
        serverError.value = undefined;
      }, 3000);
    }
  };

  return {
    data,
    errors,
    handleSubmit,
    isSubmitting,
    serverError,
    validateField,
    cancelRequest,
  };
};
