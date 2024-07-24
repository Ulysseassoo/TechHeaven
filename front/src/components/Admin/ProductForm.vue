<script setup lang="ts">
import { z } from "zod";
import type { AxiosRequestConfig } from "axios";
import { type Product } from "@/interfaces/Product";
import { updateProduct, createProduct } from "@/api/product";
import { useForm } from "@/hooks/useForm";
import { useFields } from "@/hooks/useGetFields";
import { toast } from "vue3-toastify";
import { VNumberInput } from "vuetify/labs/components";
import { useUserStore } from "@/store/UserStore";
import { ref, onMounted } from "vue";
import { getCategories } from "@/api/category";
import type { Category } from "@/interfaces/Category";

interface Props {
  product?: Product;
  disabled?: boolean;
}

const props = defineProps<Props>();
const store = useUserStore();
const categories = ref<Category[]>([]);

const fetchCategories = async () => {
  try {
    const result = await getCategories({
      limit: 100,
    });
    categories.value = result.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const validationSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().min(1),
  brand: z.string().min(1),
  quantity: z.number().min(1),
  price: z.number().min(1),
  categoryId: z.string().min(1).nullable(),
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
      if (result.status === 201) {
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
    categoryId: props.product?.categoryId ?? "",
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
  { label: "Catégorie", field: "categoryId", type: "select" },
];

const { fields } = useFields<FormValues>({ errors, fieldsConfig });

onMounted(() => fetchCategories());
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
          :disabled="
            store?.user?.role === 'ROLE_ADMIN' &&
            field.field === 'quantity' &&
            product !== undefined
          "
        ></VNumberInput>
        <VSelect
          v-else-if="field.type === 'select'"
          :items="categories"
          :item-props="true"
          item-title="name"
          item-value="id"
          variant="outlined"
          :label="field.label"
          v-model="data[field.field]"
          :error="field.hasError"
          :error-messages="field.error"
          @update:modelValue="validateField(field.field)"
          :readonly="disabled"
          placeholder="-"
          persistent-placeholder
        ></VSelect>
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
