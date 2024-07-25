<script setup lang="ts">
import type { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { useForm } from "@/hooks/useForm";
import { changeUserPassword } from "@/api/auth";
import { toast } from "vue3-toastify";

const props = defineProps<{
  onSubmit: () => void;
  email: string;
}>();

const validationSchema = z
  .object({
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
  confirmPassword: "",
};

const onSubmit = async (formData: FormValues, config: AxiosRequestConfig) => {
  try {
    await changeUserPassword({
      data: {
        password: formData.password,
        email: props.email,
      },
      config,
    });
    props.onSubmit();
    toast.success("Your password has been changed successfully.");
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const transform = {
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
  <VSheet class="mt-6">
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
        label="Mot de passe"
        v-model="data.password"
        :error="!!errors.password"
        :error-messages="errors.password"
        type="password"
        @input="validateField('password')"
        class="mb-1"
      ></VTextField>

      <VTextField
        variant="outlined"
        label="Confirmation du mot de passe"
        v-model="data.confirmPassword"
        :error="!!errors.confirmPassword"
        :error-messages="errors.confirmPassword"
        type="password"
        @input="validateField('confirmPassword')"
        class="mb-3"
      ></VTextField>

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
          >Submit</VBtn
        >
        <span
          >Already have an account ?
          <RouterLink to="/login">Login here</RouterLink></span
        >
      </Stack>
    </VForm>
  </VSheet>
</template>
