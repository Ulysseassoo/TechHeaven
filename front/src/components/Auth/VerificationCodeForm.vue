<script setup lang="ts">
import Stack from "@/components/VStack.vue";
import { z } from "zod";
import type { AxiosRequestConfig } from "axios";
import { useForm } from "@/hooks/useForm";
import { checkCode } from "@/api/auth";

const props = defineProps<{
  onNext: () => void;
  email: string;
}>();

const validationSchema = z.object({
  code: z.string().min(1, "Le code doit contenir au minimum une lettre"),
});

type FormValues = z.infer<typeof validationSchema>;

const initialValues = {
  code: "",
  email: props.email,
};

const onSubmit = async (formData: FormValues, config: AxiosRequestConfig) => {
  try {
    await checkCode({
      data: formData,
      config,
    });
    props.onNext();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const { data, handleSubmit, isSubmitting, errors, validateField, serverError } =
  useForm({
    initialValues,
    validationSchema,
    onSubmit,
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
        label="Verification code"
        v-model="data.code"
        :error="!!errors.code"
        :error-messages="errors.code"
        type="text"
        @input="validateField('code')"
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
          >Submit code</VBtn
        >
        <span
          >Already have an account ?
          <RouterLink to="/login">Login here</RouterLink></span
        >
      </Stack>
    </VForm>
  </VSheet>
</template>
