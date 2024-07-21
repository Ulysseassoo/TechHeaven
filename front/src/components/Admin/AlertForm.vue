<script setup lang="ts">
import { z } from "zod";
import type { AxiosRequestConfig } from "axios";
import { AlertTypes, type Alert } from "@/interfaces/Alert";
import { updateAlert,createAlert } from "@/api/alert";
import { useForm } from "@/hooks/useForm";
import { useFields } from "@/hooks/useGetFields";
import { toast } from "vue3-toastify";

interface Props {
  alert?: Alert;
  disabled?: boolean;
}

const props = defineProps<Props>();

const validationSchema = z.object({
  id: z.string(),
  name: z.string(),
  param: z.string().nullable().optional(),
  type: z.nativeEnum(AlertTypes),
});

type FormValues = z.infer<typeof validationSchema>;

const onSubmit = async (formData: FormValues, config: AxiosRequestConfig) => {
  try {
    if(props.alert) {
      const result = await updateAlert({
        id: props.alert.id,
        data: formData,
        config,
      });
      if (result.status === 200) {
        toast.success("Alerte mis à jour avec succès");
      }
    } else {
      const result = await createAlert({
        data: formData as Alert,
        config,
      });
      if (result.status === 200) {
        toast.success("Alerte crée avec succès");
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const { data, errors, validateField, handleSubmit } = useForm({
  initialValues: {
    id: props.alert?.id || "",
    name: props.alert?.name || "",
    type: props.alert?.type || AlertTypes.NONE,
    param: props.alert?.param || "",
  },
  validationSchema,
  onSubmit,
});

defineExpose({
  handleSubmit,
});

const fieldsConfig: any[] = [
  { label: "Nom", field: "name", type: "string" },
  { label: "Type", field: "type", type: "string" },
  { label: "Paramètre optionnel", field: "param", type: "string" },
];

const { fields } = useFields<FormValues>({ errors, fieldsConfig });
</script>

<template>
  <VForm @submit.prevent="handleSubmit">
    <v-row dense>
      <v-col v-for="field in fields" :key="field.field" cols="12" md="12" sm="12">
        <v-text-field
          variant="outlined"
          :label="field.label"
          v-model="data[field.field]"
          :error="field.hasError"
          :error-messages="field.error"
          @input="validateField(field.field)"
          :readonly="disabled"
          :type="field.type"
          placeholder="-"
          persistent-placeholder
        ></v-text-field>
      </v-col>
    </v-row>
  </VForm>
</template>
