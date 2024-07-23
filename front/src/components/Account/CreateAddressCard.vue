<script setup lang="ts">
import { ref } from "vue";
import type { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { useForm } from "@/hooks/useForm";
import { createAddress } from "@/api/address";
import { useUserStore } from "@/store/UserStore";
import { toast } from "vue3-toastify";
import { getUserInformation } from "@/api/auth";

const loading = ref(false);
const dialog = ref(false);
const store = useUserStore();

const validationSchema = z.object({
  address: z.string().min(5),
  other: z.string().optional(),
  city: z.string().min(1),
  country: z.string().min(1),
  postal_code: z.string().min(1),
});

type FormValues = z.infer<typeof validationSchema>;

const onSubmit = async (formData: FormValues, config: AxiosRequestConfig) => {
  loading.value = true;
  try {
    const result = await createAddress({
      userId: store?.user?.id,
      data: {
        ...formData,
        is_selected: true,
      },
      config,
    });
    if (result.status === 201) {
      dialog.value = false;
      loading.value = false;
      toast.success("L'addresse a bien été ajoutée avec succès!");
      const { data } = await getUserInformation();
      store.setUser(data);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const { data, errors, validateField, handleSubmit } = useForm({
  initialValues: {
    address: "",
    other: "",
    city: "",
    country: "",
    postal_code: "",
  },
  validationSchema,
  onSubmit,
});
</script>
<template>
  <v-card @click="dialog = true" variant="outlined" class="card-custom">
    <v-card-item>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        "
      >
        <v-icon size="30px" class="text-grey-lighten-1 mr-2">
          fa-solid fa-plus
        </v-icon>
        <div class="text-h5 mb-1">Ajouter une adresse</div>
      </div>
    </v-card-item>
  </v-card>
  <v-dialog v-model="dialog" width="auto" persistent max-width="800px">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div
          class="text-subtitle-1 text-medium-emphasis ps-2 align-self-center"
        >
          Ajouter une addresse
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
                label="Adresse"
                v-model="data.address"
                type="text"
                :error="!!errors['address']"
                :error-messages="errors['address']"
                @change="validateField('address')"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-text-field
                variant="outlined"
                label="Apt, suite, unité, numéro de bâtiment, etc. (facultatif)"
                v-model="data.other"
                :error="!!errors['other']"
                :error-messages="errors['other']"
                type="text"
                @change="validateField('other')"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-text-field
                variant="outlined"
                label="Pays"
                type="text"
                :error="!!errors['country']"
                :error-messages="errors['country']"
                @change="validateField('country')"
                v-model="data.country"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-text-field
                variant="outlined"
                label="Ville"
                type="text"
                :error="!!errors['city']"
                :error-messages="errors['city']"
                @change="validateField('city')"
                v-model="data.city"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                variant="outlined"
                label="Code postal"
                type="text"
                :error="!!errors['postal_code']"
                :error-messages="errors['postal_code']"
                @change="validateField('postal_code')"
                v-model="data.postal_code"
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
.card-custom {
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  border-style: dashed;
  height: 300px;
  width: 324px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  @media (max-width: 700px) {
    width: 100%;
  }
}
</style>
