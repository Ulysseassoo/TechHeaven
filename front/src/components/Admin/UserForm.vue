<script setup lang="ts">
import type { User } from "@/interfaces/User";
import type { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { useForm } from "@/hooks/useForm";
import axios from "axios";

interface Props {
  user: User;
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
  created_at: z.date(),
  deleted_at: z.date().nullable(),
  last_updated_password: z.date().nullable(),
  number_connexion_attempts: z.number(),
  blocked_until: z.date().nullable(),
});

type FormValues = z.infer<typeof validationSchema>;

const onSubmit = async (formData: FormValues, config: AxiosRequestConfig) => {
  try {
    const result = await axios.post(
      "http://localhost:8000/api/users",
      {
        ...formData,
        confirmPassword: undefined,
      },
      config,
    );
    if (result.data) {
      console.log(result.data);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const { data, errors, validateField } = useForm({
  initialValues: props.user,
  validationSchema,
  onSubmit,
});
</script>

<template>
  <v-row dense>
    <v-col cols="12" md="4" sm="6">
      <v-text-field
        label="First name*"
        v-model="data['firstname']"
        :error="!!errors['firstname']"
        :error-messages="errors['firstname']"
        @input="validateField('firstname')"
        type="text"
        required
      ></v-text-field>
    </v-col>

    <v-col cols="12" md="4" sm="6">
      <v-text-field
        hint="example of helper text only on focus"
        label="Middle name"
      ></v-text-field>
    </v-col>

    <v-col cols="12" md="4" sm="6">
      <v-text-field
        hint="example of persistent helper text"
        label="Last name*"
        persistent-hint
        required
      ></v-text-field>
    </v-col>

    <v-col cols="12" md="4" sm="6">
      <v-text-field label="Email*" required></v-text-field>
    </v-col>

    <v-col cols="12" md="4" sm="6">
      <v-text-field label="Password*" type="password" required></v-text-field>
    </v-col>

    <v-col cols="12" md="4" sm="6">
      <v-text-field
        label="Confirm Password*"
        type="password"
        required
      ></v-text-field>
    </v-col>

    <v-col cols="12" sm="6">
      <v-select
        :items="['0-17', '18-29', '30-54', '54+']"
        label="Age*"
        required
      ></v-select>
    </v-col>

    <v-col cols="12" sm="6">
      <v-autocomplete
        :items="[
          'Skiing',
          'Ice hockey',
          'Soccer',
          'Basketball',
          'Hockey',
          'Reading',
          'Writing',
          'Coding',
          'Basejump',
        ]"
        label="Interests"
        auto-select-first
        multiple
      ></v-autocomplete>
    </v-col>
  </v-row>
</template>
