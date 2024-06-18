<script setup lang="ts">
import { ref } from "vue";

interface Props {
  icon?: string;
  tooltipLabel?: string;
  color: string;
  content: string;
}

const props = defineProps<Props>();
const dialog = ref<boolean>(false);
</script>

<template>
  <v-btn :color="color" @click="dialog = true">
    <v-tooltip v-if="tooltipLabel" activator="parent" location="top">{{
      tooltipLabel
    }}</v-tooltip>
    <v-icon v-if="icon">{{ icon }}</v-icon>
    {{ content }}
  </v-btn>

  <v-dialog v-model="dialog" width="auto" persistent>
    <slot name="ModalContent">
      <v-card prepend-icon="mdi-account" title="Nouvel Utilisateur"> </v-card>
    </slot>
  </v-dialog>
</template>
