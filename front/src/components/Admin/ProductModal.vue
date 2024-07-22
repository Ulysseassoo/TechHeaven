<script setup lang="ts">
import CustomModal from "@/components/CustomModal.vue";
import ProductForm from "@/components/Admin/ProductForm.vue";
import type { Product } from "@/interfaces/Product";
import { ref } from "vue";
import type { Ref } from "vue";

type FormType = "create" | "edit" | "detail";

interface Props {
  product?: Product;
  type?: FormType;
  tooltipLabel?: string;
  btnContent?: string;
  color?: string;
  icon?: string;
  callback?: () => Promise<void>;
}

const productFormRef = ref<null | Ref<typeof ProductForm>>(null);

const props = defineProps<Props>();

const submitAction = async () => {
  try {
    if (productFormRef.value) {
      const productFormSubmit = await productFormRef.value.handleSubmit();
      if (props.callback && productFormSubmit !== undefined) await props.callback();
      return productFormSubmit !== undefined;
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
        ? 'Créer un produit'
        : type === 'edit'
        ? 'Modifier un produit'
        : 'Produit'
    "
    :btnContent="btnContent"
    :color="color"
  >
    <template v-slot:ModalContent>
      <ProductForm
        :product="product"
        ref="productFormRef"
        :disabled="type === 'detail'"
      />
    </template>
  </CustomModal>
</template>
