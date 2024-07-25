<script setup lang="ts">
import CustomModal from "@/components/CustomModal.vue";
import AlertForm from "@/components/Admin/AlertForm.vue";
import type { Alert } from "@/interfaces/Alert";
import { ref } from "vue";
import type { Ref } from "vue";

type FormType = "create" | "edit" | "detail";

interface Props {
  alert?: Alert;
  type?: FormType;
  tooltipLabel?: string;
  btnContent?: string;
  color?: string;
  icon?: string;
  callback?: () => Promise<void>;
}

const alertFormRef = ref<null | Ref<typeof AlertForm>>(null);

const props = defineProps<Props>();

const submitAction = async () => {
  try {
    if (alertFormRef.value) {
      const productFormSubmit = await alertFormRef.value.handleSubmit();
      if (props.callback && productFormSubmit !== undefined)
        await props.callback();
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
        ? 'Créer une alerte'
        : type === 'edit'
          ? 'Modifier une alerte'
          : 'Alerte'
    "
    :btnContent="btnContent"
    :color="color"
  >
    <template v-slot:ModalContent>
      <AlertForm
        :alert="alert"
        ref="alertFormRef"
        :disabled="type === 'detail'"
      />
    </template>
  </CustomModal>
</template>
