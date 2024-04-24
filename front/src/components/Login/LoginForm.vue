<script setup lang="ts">
import Stack from "../Stack.vue";
import { z } from "zod";
import axios, { AxiosRequestConfig } from "axios";
import { useForm } from "../../hooks/useForm";
import { useRouter } from "vue-router";

const validationSchema = z.object({
  email: z.string().email("L'email doit être valide."),
  password: z
    .string()
    .min(12, "Le mot de passe doit contenir au moins 12 caractères.")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule.")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule.")
    .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre.")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Le mot de passe doit contenir au moins un symbole."
    ),
});

const router = useRouter();

type FormValues = z.infer<typeof validationSchema>;

const initialValues = {
  email: "",
  password: "",
};

const onSubmit = async (formData: FormValues, config: AxiosRequestConfig) => {
  try {
    const result = await axios.post("http://localhost:8000/api/auth", formData, config);
    if(result.data) {
      localStorage.setItem("token", result.data.data);
      router.push("/")
    }
  } catch (error) {
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

const { data, handleSubmit, isSubmitting, errors, validateField, serverError } = useForm({
  initialValues,
  validationSchema,
  onSubmit,
  transform,
});
</script>

<template>
  <VSheet>
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
      <VTextField
        variant="outlined"
        label="Email"
        v-model="data.email"
        :error="!!errors.email"
        :error-messages="errors.email"
        @input="validateField('email')"
        class="mb-3"
      ></VTextField>

      <VTextField
        variant="outlined"
        label="Password"
        v-model="data.password"
        :error="!!errors.password"
        :error-messages="errors.password"
        @input="validateField('password')"
        class="mb-3"
      ></VTextField>
      <Stack align="center" justify="center" direction="column" margin="1.3rem" gap="0.4rem">
        <VBtn
          color="primary"
          height="55px"
          width="100%"
          flat
          type="submit"
          :loading="isSubmitting"
          >Log In</VBtn
        >
        <span
          >Don't have account ?
          <RouterLink to="/register">Register here</RouterLink></span
        >
      </Stack>
    </VForm>
  </VSheet>
</template>
