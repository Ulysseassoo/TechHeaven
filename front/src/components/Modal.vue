<script setup lang="ts">
import { ref } from "vue";

interface Props {
  icon?: string;
  tooltipLabel?: string;
  color?: string;
  btnContent?: string;
  saveText?: string;
  dialogMaxWidth?: string;
}

defineProps<Props>();
const dialog = ref<boolean>(false);
const loading = ref<boolean>(false);
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
    <v-card prepend-icon="fa-solid fa-user" title="Nouvel Utilisateur">
      <v-card-text>
        <slot name="ModalContent"> </slot>
      </v-card-text>
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn variant="elevated" @click="dialog = false"> Fermer </v-btn>

        <v-btn :loading="loading" variant="elevated" color="tertiary">
          {{ saveText ?? "Confirmer" }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
