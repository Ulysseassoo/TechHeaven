<script setup lang="ts">
import CustomModal from "@/components/CustomModal.vue";
import OrderForm from "@/components/Admin/OrderForm.vue";
import type { Order } from "@/interfaces/Product";
import { ref } from "vue";
import type { Ref } from "vue";

type FormType = "create" | "edit" | "detail";

interface Props {
  order?: Order;
  type?: FormType;
  tooltipLabel?: string;
  btnContent?: string;
  color?: string;
  icon?: string;
  callback?: () => Promise<void>;
}

const orderFormRef = ref<null | Ref<typeof OrderForm>>(null);

const props = defineProps<Props>();

const submitAction = async () => {
  try {
    if (orderFormRef.value) {
      const OrderFormSubmit = await orderFormRef.value.handleSubmit();
      if (props.callback && OrderFormSubmit !== undefined)
        await props.callback();
      return OrderFormSubmit !== undefined;
    }
  } catch (error) {
    console.log("erreur", error);
    throw error;
  }
};
</script>
<template>
  <CustomModal
    :tooltipLabel="tooltipLabel"
    :icon="icon"
    :submit-action="type !== 'detail' ? submitAction : undefined"
    :modalTitle="
      type === 'create'
        ? 'Créer une commande'
        : type === 'edit'
          ? 'Modifier une commande'
          : 'Commande'
    "
    :btnContent="btnContent"
    :color="color"
  >
    <template v-slot:ModalContent>
      <OrderForm
        :product="product"
        ref="orderFormRef"
        :disabled="type === 'detail'"
      />
    </template>
  </CustomModal>
</template>
