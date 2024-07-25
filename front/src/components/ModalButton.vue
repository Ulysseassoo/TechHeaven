<script setup lang="ts">
import { ref } from "vue";

interface Props {
  icon?: string;
  tooltipLabel: string;
  action: () => Promise<void>;
  title?: string;
  description?: string;
  content?: string;
  color?: string;
}

const props = defineProps<Props>();

const dialog = ref<boolean>(false);
const loading = ref<boolean>(false);
const errorMessage = ref<string | undefined>(props.description);

const executeAction = async () => {
  try {
    await props.action();
    loading.value = false;
    dialog.value = false;
    errorMessage.value = "";
  } catch (error: any) {
    loading.value = false;
    errorMessage.value = error;
  }
};
</script>

<template>
  <v-btn :color="color ?? 'initial'" @click="dialog = true">
    <v-tooltip v-if="tooltipLabel" activator="parent" location="top">{{
      tooltipLabel
    }}</v-tooltip>
    <v-icon v-if="icon">{{ icon }}</v-icon>
    {{ content }}
  </v-btn>

  <v-dialog v-model="dialog" width="auto" persistent>
    <v-card
      max-width="400"
      prepend-icon="fa-solid fa-info-circle"
      :text="errorMessage"
      :title="title"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn
          style="background-color: #b00020; color: white"
          variant="elevated"
          @click="dialog = false"
        >
          Fermer
        </v-btn>

        <v-btn
          @click="
            () => {
              dialog = false;
              executeAction();
            }
          "
          :loading="loading"
          variant="elevated"
        >
          Confirmer
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
