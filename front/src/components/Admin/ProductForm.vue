<script setup lang="ts">
import { z } from "zod";
import type { AxiosRequestConfig } from "axios";
import { type Product } from "@/interfaces/Product";
import { updateProduct, createProduct } from "@/api/product";
import { useForm } from "@/hooks/useForm";
import { useFields } from "@/hooks/useGetFields";
import { toast } from "vue3-toastify";
import { VNumberInput } from "vuetify/labs/components";

interface Props {
  product?: Product;
  disabled?: boolean;
}

const props = defineProps<Props>();

const validationSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  brand: z.string(),
  quantity: z.number().min(1),
  price: z.number().min(1),
});

type FormValues = z.infer<typeof validationSchema>;

const onSubmit = async (formData: FormValues, config: AxiosRequestConfig) => {
  try {
    if (props.product) {
      const result = await updateProduct({
        id: props.product.id,
        data: formData,
        config,
      });
      if (result.status === 200) {
        toast.success("Produit mis à jour avec succès");
      }
    } else {
      const result = await createProduct({
        data: formData as Product,
        config,
      });
      if (result.status === 200) {
        toast.success("Produit crée avec succès");
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const { data, errors, validateField, handleSubmit } = useForm({
  initialValues: {
    id: props.product?.id ?? "",
    name: props.product?.name ?? "",
    description: props.product?.description ?? "",
    brand: props.product?.brand ?? "",
    quantity: props.product?.quantity ?? 0,
    price: props.product?.price ?? 0,
  },
  validationSchema,
  onSubmit,
});

defineExpose({
  handleSubmit,
});

const fieldsConfig: any[] = [
  { label: "Nom", field: "name", type: "string" },
  { label: "Description", field: "description", type: "string" },
  { label: "Marque", field: "brand", type: "string" },
  { label: "Quantité", field: "quantity", type: "number" },
  { label: "Prix", field: "price", type: "number" },
];

const { fields } = useFields<FormValues>({ errors, fieldsConfig });
</script>

<template>
  <VForm @submit.prevent="handleSubmit">
    <v-row dense>
      <v-col
        v-for="field in fields"
        :key="field.field"
        cols="12"
        md="12"
        sm="12"
      >
        <VNumberInput
          v-if="field.type === 'number'"
          variant="outlined"
          control-variant="stacked"
          :label="field.label"
          v-model="data[field.field]"
          :error="field.hasError"
          :error-messages="field.error"
          @input="validateField(field.field)"
          :readonly="disabled"
          :type="field.type"
          placeholder="-"
          persistent-placeholder
        ></VNumberInput>
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
