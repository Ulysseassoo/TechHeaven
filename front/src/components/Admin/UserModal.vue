<script setup lang="ts">
import CustomModal from "@/components/CustomModal.vue";
import UserForm from "@/components/Admin/UserForm.vue";
import type { User } from "@/interfaces/User";
import { ref } from "vue";
import type { Ref } from "vue";

interface Props {
  user: User;
  canEdit?: boolean;
  tooltipLabel: string;
  icon: string;
  callback?: () => Promise<void>;
}

const userFormRef = ref<null | Ref<typeof UserForm>>(null);

const props = defineProps<Props>();

const submitAction = async () => {
  try {
    if (userFormRef.value) {
      await userFormRef.value.handleSubmit();
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
    :modalTitle="canEdit ? 'Editer' : 'Utilisateur'"
  >
    <template v-slot:ModalContent>
      <UserForm
        :user="user"
        ref="userFormRef"
        :disabled="!canEdit ? true : false"
      />
    </template>
  </CustomModal>
</template>
