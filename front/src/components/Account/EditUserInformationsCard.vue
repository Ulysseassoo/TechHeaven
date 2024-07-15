<script setup lang="ts">
import type { User } from "@/interfaces/User";
import { ref } from "vue";
import type { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { useForm } from "@/hooks/useForm";
import { updateUser } from "@/api/user";
import { toast } from "vue3-toastify";
import { useUserStore } from "@/store/UserStore";

const props = defineProps<{ user: User }>();
const dialog = ref(false);
const loading = ref(false);
const store = useUserStore();

const validationSchema = z.object({
  firstname: z.string().nullable(),
  lastname: z.string().nullable(),
  email: z.string().email(),
  phone: z.string().nullable(),
});

type FormValues = z.infer<typeof validationSchema>;

const onSubmit = async (formData: FormValues, config: AxiosRequestConfig) => {
  loading.value = true;
  try {
    const result = await updateUser({
      id: props.user.id,
      data: formData,
      config,
    });
    if (result.status === 200) {
      dialog.value = false;
      loading.value = false;
      store.setUser({
        ...props.user,
        ...result.data,
      });
      toast.success("Les informations ont été mis à jour avec succès");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const { data, errors, validateField, handleSubmit } = useForm({
  initialValues: {
    email: props.user.email,
    lastname: props.user.lastname,
    firstname: props.user.firstname,
    phone: props.user.phone,
  },
  validationSchema,
  onSubmit,
});
</script>

<template>
  <v-card
    class="bg-paper-primary-light shadow-short rounded-lg"
    title="Informations personnelles"
    subtitle="Modifier les informations personnelles"
  >
    <template v-slot:append>
      <v-btn
        @click="dialog = true"
        icon="fa-solid fa-pen"
        size="x-small"
      ></v-btn>
    </template>
    <v-card-text
      class="p-4 mb-8 bg-white md:h-full md:mb-0 md:p-6 md:rounded-2"
    >
      <div class="flex items-center">
        <div class="body-1-light">
          <div>{{ user?.firstname }} {{ user?.lastname }}</div>
          <div>{{ user?.email }}</div>
          <div>{{ user?.phone }}</div>
        </div>
      </div>
      <div class="d-flex ga-2 flex-column mt-2">
        <p
          class="text-decoration-underline font-weight-bold cursor-pointer w-auto align-self-start"
        >
          Modifier mon mot de passe
        </p>
        <RouterLink
          to="/account/delete-account"
          class="text-decoration-underline font-weight-bold w-auto align-self-start link"
          >Supprimer mon compte</RouterLink
        >
      </div>
    </v-card-text>
  </v-card>

  <v-dialog v-model="dialog" width="auto" persistent max-width="800px">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div
          class="text-subtitle-1 text-medium-emphasis ps-2 align-self-center"
        >
          Infos personnelles
        </div>

        <v-btn
          icon="fa-solid fa-xmark"
          variant="text"
          @click="dialog = false"
        ></v-btn>
      </v-card-title>
      <v-divider class="mb-4"></v-divider>
      <v-card-text>
        <VForm style="width: 600px" @submit.prevent="handleSubmit">
          <v-row dense>
            <v-col>
              <v-text-field
                variant="outlined"
                label="Prénom"
                v-model="data.firstname"
                type="text"
                :error="!!errors['firstname']"
                :error-messages="errors['firstname']"
                @change="validateField('firstname')"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                variant="outlined"
                label="Nom"
                v-model="data.lastname"
                :error="!!errors['lastname']"
                :error-messages="errors['lastname']"
                type="text"
                @change="validateField('lastname')"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-text-field
                variant="outlined"
                label="Email"
                type="text"
                :error="!!errors['email']"
                :error-messages="errors['email']"
                @change="validateField('email')"
                v-model="data.email"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-text-field
                variant="outlined"
                label="Numéro de téléphone"
                hint="Optionnel"
                type="text"
                :error="!!errors['phone']"
                :error-messages="errors['phone']"
                @change="validateField('phone')"
                v-model="data.phone"
                persistent-hint
              ></v-text-field>
            </v-col>
          </v-row>
          <div class="mt-4">
            <v-spacer></v-spacer>
            <v-btn
              :loading="loading"
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
.link {
  color: black;
}
</style>
