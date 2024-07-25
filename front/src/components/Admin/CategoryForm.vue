<script setup lang="ts">
import { z } from "zod";
import type { AxiosRequestConfig } from "axios";
import { type Category } from "@/interfaces/Category";
import { updateCategory, createCategory } from "@/api/category";
import { useForm } from "@/hooks/useForm";
import { useFields } from "@/hooks/useGetFields";
import { toast } from "vue3-toastify";

interface Props {
  category?: Category;
  disabled?: boolean;
}

const props = defineProps<Props>();

const validationSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
});

type FormValues = z.infer<typeof validationSchema>;

const onSubmit = async (formData: FormValues, config: AxiosRequestConfig) => {
  try {
    if (props.category) {
      const result = await updateCategory({
        id: props.category.id,
        data: formData,
        config,
      });
      if (result.status === 200) {
        toast.success("Produit mis à jour avec succès");
      }
    } else {
      const result = await createCategory({
        data: formData as Category,
        config,
      });
      if (result.status === 201) {
        toast.success("Catégorie crée avec succès");
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const { data, errors, validateField, handleSubmit } = useForm({
  initialValues: {
    id: props.category?.id ?? "",
    name: props.category?.name ?? "",
  },
  validationSchema,
  onSubmit,
});

defineExpose({
  handleSubmit,
});

const fieldsConfig: any[] = [{ label: "Nom", field: "name", type: "string" }];

const { fields } = useFields<FormValues>({ errors, fieldsConfig });
</script>

<template>
  <VForm @submit.prevent="handleSubmit" @keydown.enter.prevent="handleSubmit">
    <v-row dense>
      <v-col
        v-for="field in fields"
        :key="field.field"
        cols="12"
        md="12"
        sm="12"
      >
        <v-text-field
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
