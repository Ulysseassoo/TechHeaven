<script setup lang="ts">
import { ref } from "vue";

interface Props {
  icon?: string;
  tooltipLabel?: string;
  color?: string;
  btnContent?: string;
  saveText?: string;
  dialogMaxWidth?: string;
  modalTitle?: string;
  submitAction?: () => Promise<boolean | undefined>;
}

const props = defineProps<Props>();
const dialog = ref<boolean>(false);
const loading = ref<boolean>(false);
const handleSubmit = async () => {
  try {
    loading.value = true;
    if (props.submitAction) {
      const submitPromise = await props.submitAction();
      if (submitPromise === true) {
        dialog.value = false;
      }
    }
    loading.value = false;
  } catch (error) {
    loading.value = false;
    throw error;
  }
};
</script>

<template>
  <v-btn :color="color" @click="dialog = true">
    <v-tooltip v-if="tooltipLabel" activator="parent" location="top">{{
      tooltipLabel
    }}</v-tooltip>
    <v-icon v-if="icon">{{ icon }}</v-icon>
    {{ btnContent }}
  </v-btn>

  <v-dialog v-model="dialog" width="auto" persistent :max-width="dialogMaxWidth">
    <v-card prepend-icon="fa-solid fa-user" :title="modalTitle">
      <v-card-text>
        <slot name="ModalContent"> </slot>
      </v-card-text>
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn variant="elevated" @click="dialog = false"> Fermer </v-btn>

        <v-btn
          @click="handleSubmit"
          v-if="submitAction"
          :loading="loading"
          variant="elevated"
          color="tertiary"
        >
          {{ saveText ?? "Confirmer" }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
