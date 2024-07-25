<script setup lang="ts">
import { z } from "zod";
import type { AxiosRequestConfig } from "axios";
import { type Order, OrderStatus } from "@/interfaces/Order";
import { updateOrder } from "@/api/order";
import { useForm } from "@/hooks/useForm";
import { useFields } from "@/hooks/useGetFields";
import { toast } from "vue3-toastify";

interface Props {
  order?: Order;
  disabled?: boolean;
}

const props = defineProps<Props>();

const validationSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  total_amount: z.number(),
  status: z.nativeEnum(OrderStatus),
});

type FormValues = z.infer<typeof validationSchema>;

const onSubmit = async (formData: FormValues, config: AxiosRequestConfig) => {
  try {
    if (props.order) {
      const result = await updateOrder({
        id: props.order.id,
        data: formData,
        config,
      });
      if (result.status === 200) {
        toast.success("Commande mis à jour avec succès");
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const statuses = [
  {
    id: 1,
    name: OrderStatus.PENDING,
  },
  {
    id: 2,
    name: OrderStatus.COMPLETED,
  },
  {
    id: 3,
    name: OrderStatus.CANCELED,
  },
];

const { data, errors, validateField, handleSubmit } = useForm({
  initialValues: {
    id: props.order?.id || "",
    created_at: props.order?.created_at || "",
    total_amount: props.order?.total_amount,
    status: props.order?.status || OrderStatus.PENDING,
  },
  validationSchema,
  // @ts-ignore
  onSubmit,
});

defineExpose({
  handleSubmit,
});

const fieldsConfig: any[] = [
  { label: "id", field: "status", type: "select" },
  { label: "Status", field: "status", type: "select" },
];

const { fields } = useFields<FormValues>({ errors, fieldsConfig });
</script>

<template>
  <VForm @submit.prevent="handleSubmit">
    <v-row dense>
      <v-col v-for="field in fields" :key="field.field" cols="12" md="12" sm="12">
        <VSelect
          :items="statuses"
          :item-props="true"
          item-title="name"
          item-value="name"
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
      </v-col>
    </v-row>
  </VForm>
</template>
