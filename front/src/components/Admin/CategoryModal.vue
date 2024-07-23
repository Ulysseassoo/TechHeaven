<script setup lang="ts">
import CustomModal from "@/components/CustomModal.vue";
import CategoryForm from "@/components/Admin/CategoryForm.vue";
import type { Category } from "@/interfaces/Category";
import { ref } from "vue";
import type { Ref } from "vue";

type FormType = "create" | "edit" | "detail";

interface Props {
  category?: Category;
  type?: FormType;
  tooltipLabel?: string;
  btnContent?: string;
  color?: string;
  icon?: string;
  callback?: () => Promise<void>;
}

const categoryFormRef = ref<null | Ref<typeof CategoryForm>>(null);

const props = defineProps<Props>();

const submitAction = async () => {
  try {
    if (categoryFormRef.value) {
      const productFormSubmit = await categoryFormRef.value.handleSubmit();
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
        ? 'Créer une catégorie'
        : type === 'edit'
        ? 'Modifier une catégorie'
        : 'Catégorie'
    "
    :btnContent="btnContent"
    :color="color"
  >
    <template v-slot:ModalContent>
      <CategoryForm
        :category="category"
        ref="categoryFormRef"
        :disabled="type === 'detail'"
      />
    </template>
  </CustomModal>
</template>
