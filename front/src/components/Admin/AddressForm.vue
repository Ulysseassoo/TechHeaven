<script setup lang="ts">
import type { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { useForm } from "@/hooks/useForm";
import { useFields } from "@/hooks/useGetFields";
import { toast } from "vue3-toastify";
import type { Address } from "@/interfaces/Address";
import { updateAddress } from "@/api/address";

interface Props {
  address: Address;
  disabled?: boolean;
}

const props = defineProps<Props>();

const validationSchema = z.object({
  id: z.string(),
  address: z.string(),
  other: z.string().optional(),
  city: z.string(),
  country: z.string(),
  postal_code: z.string(),
  is_selected: z.boolean(),
});

type FormValues = z.infer<typeof validationSchema>;

const onSubmit = async (formData: FormValues, config: AxiosRequestConfig) => {
  try {
    const result = await updateAddress({
      id: props.address.id,
      data: formData,
      config,
    });
    if (result.status === 200) {
      toast.success("Adresse mis à jour avec succès");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const { data, errors, validateField, handleSubmit } = useForm({
  initialValues: props.address,
  validationSchema,
  onSubmit,
});

defineExpose({
  handleSubmit,
});

const fieldsConfig: any[] = [
  { label: "Ville", field: "city", type: "string" },
  { label: "Pays", field: "country", type: "string" },
  { label: "Adresse", field: "address", type: "string" },
  { label: "Code Postal", field: "postal_code", type: "string" },
  { label: "Information supplémentaire", field: "other", type: "string" },
];

const { fields } = useFields<FormValues>({ errors, fieldsConfig });
</script>

<template>
  <VForm @submit.prevent="handleSubmit">
    <v-row dense>
      <v-col v-for="field in fields" :key="field.field" cols="12" md="12" sm="12">
        <v-checkbox
          v-if="field.type === 'boolean'"
          :label="field.label"
          v-model="data[field.field]"
          @change="validateField(field.field)"
          :error="field.hasError"
          :readonly="disabled"
          :error-messages="field.error"
        ></v-checkbox>
        <v-text-field
          v-else
          variant="outlined"
          :label="field.label"
          v-model="data[field.field]"
          :error="field.hasError"
          :error-messages="field.error"
          @input="validateField(field.field)"
          :readonly="disabled"
          :type="field.type"
          placeholder="-"
          persistent-placeholder
        ></v-text-field>
      </v-col>
    </v-row>
  </VForm>
</template>
