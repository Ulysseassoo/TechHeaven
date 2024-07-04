<script setup lang="ts">
import Stack from "@/components/VStack.vue";
import { z } from "zod";
import type { AxiosRequestConfig } from "axios";
import { useForm } from "@/hooks/useForm";
import { useRouter } from "vue-router";
import { loginUser } from "@/api/auth";

const validationSchema = z.object({
  email: z.string().email("L'email doit être valide."),
  password: z
    .string()
    .min(1, "Le mot de passe doit contenir au moins 1 caractères."),
});

const router = useRouter();

type FormValues = z.infer<typeof validationSchema>;

const initialValues = {
  email: "",
  password: "",
};

const onSubmit = async (formData: FormValues, config: AxiosRequestConfig) => {
  try {
    const result = await loginUser({ data: formData, config });
    if (result.data) {
      localStorage.setItem("token", result.data.data);
      router.push("/");
    }
  } catch (error) {
    console.log(error);
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
        type="text"
        @input="validateField('email')"
        class="mb-3"
      ></VTextField>

      <VTextField
        variant="outlined"
        label="Password"
        v-model="data.password"
        :error="!!errors.password"
        :error-messages="errors.password"
        type="password"
        @input="validateField('password')"
      ></VTextField>
      <div
        style="
          display: flex;
          flex-direction: row-reverse;
          margin-bottom: 0.4rem;
        "
      >
        <RouterLink to="/forgot-password" style="color: black"
          >Forgot password ?</RouterLink
        >
      </div>
      <VCard class="mb-12" color="surface-variant" variant="tonal">
        <VCardText class="text-medium-emphasis text-caption">
          Warning: After 3 consecutive failed login attempts, you account will
          be temporarily locked for three hours. If you must login now, you can
          also click "Forgot login password?" below to reset the login password.
        </VCardText>
      </VCard>
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
