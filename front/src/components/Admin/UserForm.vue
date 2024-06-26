<script setup lang="ts">
import type { User } from "@/interfaces/User";
import type { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { useForm } from "@/hooks/useForm";
import { useFields } from "@/hooks/useGetFields";
import { VNumberInput } from "vuetify/labs/components";
import { updateUser } from "@/api/user";
import { toast } from "vue3-toastify";

interface Props {
  user: User;
  disabled?: boolean;
}

const props = defineProps<Props>();

const validationSchema = z.object({
  id: z.string(),
  firstname: z.string().nullable(),
  lastname: z.string().nullable(),
  email: z.string().email(),
  phone: z.string().nullable(),
  role: z.string(),
  has_confirmed_account: z.boolean(),
  created_at: z.string(),
  deleted_at: z.string().nullable(),
  last_updated_password: z.string().nullable(),
  number_connexion_attempts: z
    .number()
    .refine((value) => !isNaN(value), "Veuillez entrer un nombre valide"),
  blocked_until: z.string().nullable(),
});

type FormValues = z.infer<typeof validationSchema>;

const onSubmit = async (formData: FormValues, config: AxiosRequestConfig) => {
  try {
    const result = await updateUser({
      userId: props.user.id,
      data: formData,
      config,
    });
    if (result.status === 200) {
      toast.success("Utilisateur mis à jour avec succès");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const { data, errors, validateField, handleSubmit } = useForm({
  initialValues: {
    ...props.user,
    blocked_until: props.user.blocked_until
      ? props.user.blocked_until.split("Z")[0]
      : null,
    created_at: props.user.created_at.split("Z")[0],
    deleted_at: props.user.deleted_at ? props.user.deleted_at.split("Z")[0] : null,
    last_updated_password: props.user.last_updated_password
      ? props.user.last_updated_password.split("Z")[0]
      : null,
  },
  validationSchema,
  onSubmit,
});

defineExpose({
  handleSubmit,
});

const fieldsConfig: any[] = [
  { label: "Compte confirmé", field: "has_confirmed_account", type: "boolean" },
  { label: "Prénom", field: "firstname", type: "string" },
  { label: "Nom", field: "lastname", type: "string" },
  { label: "Email", field: "email", type: "email" },
  { label: "Numéro de téléphone", field: "phone", type: "string" },
  { label: "Rôle", field: "role", type: "string" },
  { label: "Crée le", field: "created_at", type: "datetime-local" },
  { label: "Supprimé le", field: "deleted_at", type: "datetime-local" },
  {
    label: "Mot de passe mis à jour pour la dernière fois le",
    field: "last_updated_password",
    type: "datetime-local",
  },
  {
    label: "Nombre de connexion tenté",
    field: "number_connexion_attempts",
    type: "number",
  },
  { label: "Bloqué jusqu'à", field: "blocked_until", type: "datetime-local" },
];

const { fields } = useFields<FormValues>({ errors, fieldsConfig });
</script>

<template>
  <VForm @submit.prevent="handleSubmit">
    <v-row dense>
      <v-col v-for="field in fields" :key="field.field" cols="12" md="4" sm="6">
        <v-checkbox
          v-if="field.type === 'boolean'"
          :label="field.label"
          v-model="data[field.field]"
          @change="validateField(field.field)"
          :error="field.hasError"
          :disabled="disabled"
          :error-messages="field.error"
        ></v-checkbox>
        <VNumberInput
          v-else-if="field.type === 'number'"
          variant="outlined"
          control-variant="stacked"
          :label="field.label"
          v-model="data[field.field]"
          :error="field.hasError"
          :error-messages="field.error"
          @input="validateField(field.field)"
          :disabled="disabled"
          :type="field.type"
          placeholder="-"
          persistent-placeholder
        ></VNumberInput>
        <v-text-field
          v-else
          variant="outlined"
          :label="field.label"
          v-model="data[field.field]"
          :error="field.hasError"
          :error-messages="field.error"
          @input="validateField(field.field)"
          :disabled="disabled"
          :type="field.type"
          placeholder="-"
          persistent-placeholder
        ></v-text-field>
      </v-col>
    </v-row>
  </VForm>
</template>
