<script setup lang="ts">
import type { ButtonVariants } from "@/types/VutifyButtonTypes";
withDefaults(
  defineProps<{
    content: string;
    color?: string;
    type?: ButtonVariants;
  }>(),
  {
    color: "blue",
    type: "flat",
  },
);
</script>

<template>
  <VBtn :base-color="color" :variant="type">{{ content }}</VBtn>
</template>
