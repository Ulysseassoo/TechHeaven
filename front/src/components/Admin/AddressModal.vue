<script setup lang="ts">
import CustomModal from "@/components/CustomModal.vue";
import AddressForm from "@/components/Admin/AddressForm.vue";
import type { Address } from "@/interfaces/Address";
import { ref } from "vue";
import type { Ref } from "vue";

interface Props {
  address: Address;
  canEdit?: boolean;
  tooltipLabel: string;
  icon: string;
  callback?: () => Promise<void>;
}

const addressFormRef = ref<null | Ref<typeof AddressForm>>(null);

const props = defineProps<Props>();

const submitAction = async () => {
  try {
    if (addressFormRef.value) {
      await addressFormRef.value.handleSubmit();
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
    :modalTitle="canEdit ? 'Editer' : 'Adresse'"
  >
    <template v-slot:ModalContent>
      <AddressForm
        :address="address"
        ref="addressFormRef"
        :disabled="!canEdit ? true : false"
      />
    </template>
  </CustomModal>
</template>
