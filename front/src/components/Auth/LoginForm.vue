<script setup lang="ts">
import Stack from "@/components/VStack.vue";
import { z } from "zod";
import type { AxiosRequestConfig } from "axios";
import { useForm } from "@/hooks/useForm";
import { useRouter } from "vue-router";
import { loginUser, getUserInformation } from "@/api/auth";
import { useUserStore } from "@/store/UserStore";
import { useBasketStore } from "@/store/basketStore";

const validationSchema = z.object({
  email: z.string().email("L'email doit être valide."),
  password: z.string().min(1, "Le mot de passe doit contenir au moins 1 caractères."),
});

const router = useRouter();

const store = useUserStore();
const basketStore = useBasketStore();

type FormValues = z.infer<typeof validationSchema>;

const initialValues = {
  email: "",
  password: "",
};

const onSubmit = async (formData: FormValues, config: AxiosRequestConfig) => {
  try {
    const result = await loginUser({ data: formData, config });
    if (result.data) {
      localStorage.setItem("token", result.data);
      basketStore.fetchBasketProducts();
      basketStore.fetchBasket();
      const response = await getUserInformation();
      store.setUser(response.data);
      if (response.data.role === "ROLE_ADMIN") {
        router.push("/admin");
      } else if (response.data.role === "ROLE_STORE_KEEPER") {
        router.push("/keeper");
      } else {
        router.push("/");
      }
    }
  } catch (error) {
    throw error;
  }
};

const transform = {
  email: (oldValue: string) => {
    return oldValue.trim();
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
  <VSheet style="background: #f8f9fc">
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
        label="Mot de passe"
        v-model="data.password"
        :error="!!errors.password"
        :error-messages="errors.password"
        type="password"
        @input="validateField('password')"
      ></VTextField>
      <div style="display: flex; flex-direction: row-reverse; margin-bottom: 0.4rem">
        <RouterLink to="/forgot-password" style="color: black"
          >Mot de passe oublié ?</RouterLink
        >
      </div>
      <VCard class="mb-12" color="surface-variant" variant="tonal">
        <VCardText class="text-medium-emphasis text-caption">
          Avertissement: Après 3 tentatives de connexion échouées consécutives, votre
          compte sera temporairement verrouillé pendant trois heures. Si vous devez vous
          connecter maintenant, vous pouvez Cliquez également sur "Mot de passe oublié?"
          ci-dessus pour réinitialiser le mot de passe.
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
          >Se connecter</VBtn
        >
        <span
          >Pas de compte ?
          <RouterLink to="/register">Enregistrez vous ici</RouterLink></span
        >
      </Stack>
    </VForm>
  </VSheet>
</template>
