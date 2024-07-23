<script setup lang="ts">
import { changeUserPassword } from "@/api/auth";
import { useForm } from "@/hooks/useForm";
import type { AxiosRequestConfig } from "axios";
import { onMounted, ref } from "vue";
import { toast } from "vue3-toastify";
import { z } from "zod";

const props = defineProps<{ email: string }>();
const dialog = ref(false);

onMounted(() => {
  const queryParams = new URLSearchParams(window.location.search);
  const changePassword = queryParams.get("changePassword");
  if (changePassword === "true") {
    dialog.value = true;
    const url = new URL(window.location.href);
    url.searchParams.delete("changePassword");
    window.history.pushState({}, "", url);
  }
});

const validationSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, "L'ancien mot de passe doit contenir au moins 1 caractère"),
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

const initialValues = {
  email: props.email,
  password: "",
  oldPassword: "",
  confirmPassword: "",
};

const onSubmit = async (formData: FormValues, config: AxiosRequestConfig) => {
  try {
    await changeUserPassword({
      data: {
        oldPassword: formData.oldPassword,
        confirmPassword: formData.confirmPassword,
        password: formData.password,
        email: props.email,
      },
      config,
    });
    dialog.value = false;
    toast.success("Le mot de passe a été modifié avec succès");
  } catch (error: any) {
    toast.error(error.response.data.message || "Une erreur s'est produite");
    throw error;
  }
};

const transform = {
  password: (oldValue: string) => {
    return oldValue.trim();
  },
  oldPassword: (oldValue: string) => {
    return oldValue.trim();
  },
  confirmPassword: (oldValue: string) => {
    return oldValue.trim();
  },
};

const { data, handleSubmit, isSubmitting, errors, validateField } = useForm({
  initialValues,
  validationSchema,
  onSubmit,
  transform,
});
</script>

<template>
  <p
    class="text-decoration-underline font-weight-bold cursor-pointer w-auto align-self-start"
    @click="dialog = true"
  >
    Modifier mon mot de passe
  </p>
  <v-dialog v-model="dialog" width="auto" persistent max-width="800px">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div
          class="text-subtitle-1 text-medium-emphasis ps-2 align-self-center"
        >
          Modifier mon mot de passe
        </div>

        <v-btn
          icon="fa-solid fa-xmark"
          variant="text"
          @click="dialog = false"
        ></v-btn>
      </v-card-title>
      <v-divider class="mb-4"></v-divider>
      <v-card-text>
        <VForm class="form" @submit.prevent="handleSubmit">
          <v-row dense>
            <v-col>
              <v-text-field
                variant="outlined"
                label="Mot de passe actuel"
                v-model="data.oldPassword"
                type="password"
                :error="!!errors['oldPassword']"
                :error-messages="errors['oldPassword']"
                @change="validateField('oldPassword')"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-text-field
                variant="outlined"
                label="Nouveau mot de passe"
                v-model="data.password"
                type="password"
                :error="!!errors['password']"
                :error-messages="errors['password']"
                @change="validateField('password')"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-text-field
                variant="outlined"
                label="Répéter le nouveau mot de passe"
                v-model="data.confirmPassword"
                type="password"
                :error="!!errors['confirmPassword']"
                :error-messages="errors['confirmPassword']"
                @change="validateField('confirmPassword')"
              ></v-text-field>
            </v-col>
          </v-row>
          <div class="mt-4">
            <v-spacer></v-spacer>
            <v-btn
              :loading="isSubmitting"
              variant="elevated"
              class="w-100 text-overline text-capitalize"
              size="large"
              color="tertiary"
              type="submit"
            >
              Enregistrer
            </v-btn>
          </div>
        </VForm>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<style scoped>
.form {
  max-width: 600px;
  min-width: 500px;
  @media (max-width: 700px) {
    width: 100%;
    min-width: auto;
  }
}
</style>
