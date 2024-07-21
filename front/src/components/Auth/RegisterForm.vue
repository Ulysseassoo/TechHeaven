<script setup lang="ts">
import Stack from "@/components/VStack.vue";
import { z } from "zod";
import type { AxiosRequestConfig } from "axios";
import { useForm } from "@/hooks/useForm";
import { computed, ref } from "vue";
import { registerUser } from "@/api/auth";

const validationSchema = z
  .object({
    email: z.string().email("L'email doit être valide."),
    firstname: z
      .string()
      .min(2, "Le prénom doit contenir au moins 2 caractères."),
    lastname: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
    password: z
      .string()
      .min(12, "Le mot de passe doit contenir au moins 12 caractères.")
      .regex(
        /[a-z]/,
        "Le mot de passe doit contenir au moins une lettre minuscule.",
      )
      .regex(
        /[A-Z]/,
        "Le mot de passe doit contenir au moins une lettre majuscule.",
      )
      .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre.")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Le mot de passe doit contenir au moins un symbole.",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof validationSchema>;

interface Field {
  label: string;
  field: keyof FormValues;
  hasError: boolean;
  error: string | null;
  type: string;
}

const initialValues = {
  email: "",
  password: "",
  firstname: "",
  lastname: "",
  confirmPassword: "",
};

const successMessage = ref<string | undefined>(undefined);

const onSubmit = async (formData: FormValues, config: AxiosRequestConfig) => {
  try {
    const result = await registerUser({
      data: { ...formData, confirmPassword: undefined },
      config,
    });

    if (result.data) {
      successMessage.value =
        "Vous avez reçu un mail. Merci de confirmer votre compte !";
    }
  } catch (error) {
    successMessage.value = undefined;
    throw error;
  }
};

const transform = {
  email: (oldValue: string) => {
    return oldValue.trim().toLowerCase();
  },
  password: (oldValue: string) => {
    return oldValue.trim();
  },
};

const { data, handleSubmit, isSubmitting, errors, validateField, serverError } =
  useForm({
    initialValues,
    validationSchema,
    onSubmit,
    transform,
  });

const fields = computed<Field[]>(() => [
  {
    label: "Nom",
    field: "lastname",
    hasError: !!errors["lastname"],
    type: "text",
    error: errors["lastname"],
  },
  {
    label: "Prénom",
    field: "firstname",
    type: "text",
    hasError: !!errors["firstname"],
    error: errors["firstname"],
  },
  {
    label: "Email",
    field: "email",
    type: "email",
    hasError: !!errors["email"],
    error: errors["email"],
  },
  {
    label: "Mot de passe",
    field: "password",
    type: "password",
    hasError: !!errors["password"],
    error: errors["password"],
  },
  {
    label: "Confirmation du mot de passe",
    field: "confirmPassword",
    type: "password",
    hasError: false,
    error: errors["confirmPassword"],
  },
]);
</script>

<template>
  <VSheet style="background: #f8f9fc">
    <VAlert
      type="success"
      title="Succès"
      :text="successMessage"
      class="mb-5"
      variant="tonal"
      density="compact"
      v-show="!!successMessage"
      border
    ></VAlert>
    <VAlert
      type="error"
      title="Erreur"
      :text="serverError"
      class="mb-5"
      variant="tonal"
      density="compact"
      v-show="!!serverError"
      border
    ></VAlert>
    <VForm @submit.prevent="handleSubmit">
      <div v-for="field in fields" :key="field.field">
        <VTextField
          variant="outlined"
          :label="field.label"
          v-model="data[field.field]"
          :error="field.hasError"
          :error-messages="field.error"
          @input="validateField(field.field)"
          :type="field.type"
          class="mb-3"
        />
      </div>
      <Stack
        align="center"
        justify="center"
        direction="column"
        margin="1.3rem"
        gap="0.4rem"
      >
        <VBtn
          color="primary"
          height="55px"
          width="100%"
          flat
          type="submit"
          :loading="isSubmitting"
          >Register</VBtn
        >
        <span
          >Already have an account ?
          <RouterLink to="/login">Log in here</RouterLink></span
        >
      </Stack>
    </VForm>
  </VSheet>
</template>
