<script setup lang="ts">
import CustomModal from "@/components/CustomModal.vue";
import AlertForm from "@/components/Admin/AlertForm.vue";
import type { Alert } from "@/interfaces/Alert";
import { ref } from "vue";
import type { Ref } from "vue";

interface Props {
  alert: Alert;
  canEdit?: boolean;
  tooltipLabel: string;
  icon: string;
  callback?: () => Promise<void>;
}

const alertFormRef = ref<null | Ref<typeof AlertForm>>(null);

const props = defineProps<Props>();

const submitAction = async () => {
  try {
    if (alertFormRef.value) {
      await alertFormRef.value.handleSubmit();
      if (props.callback) await props.callback();
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
    :submit-action="canEdit ? submitAction : undefined"
    :modalTitle="canEdit ? 'Editer' : 'Alerte'"
  >
    <template v-slot:ModalContent>
      <AlertForm
        :alert="alert"
        ref="alertFormRef"
        :disabled="!canEdit ? true : false"
      />
    </template>
  </CustomModal>
</template>
