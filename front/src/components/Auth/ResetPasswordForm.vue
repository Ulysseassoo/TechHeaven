<script setup lang="ts">
import Stack from "@/components/VStack.vue";
import { z } from "zod";
import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { useForm } from "@/hooks/useForm";

const props = defineProps<{
  onNext: (email: string) => void;
}>();

const validationSchema = z.object({
  email: z.string().email("L'email doit être valide."),
});

type FormValues = z.infer<typeof validationSchema>;

const initialValues = {
  email: "",
};

const onSubmit = async (formData: FormValues, config: AxiosRequestConfig) => {
  try {
    await axios.post(
      "http://localhost:8000/api/reset/password",
      formData,
      config,
    );
    props.onNext(formData.email);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const transform = {
  email: (oldValue: string) => {
    return oldValue.trim().toLowerCase();
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
        label="Your email"
        v-model="data.email"
        :error="!!errors.email"
        :error-messages="errors.email"
        type="text"
        @input="validateField('email')"
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
          >Recover password</VBtn
        >
        <span
          >Already have an account ?
          <RouterLink to="/login">Login here</RouterLink></span
        >
      </Stack>
    </VForm>
  </VSheet>
</template>
