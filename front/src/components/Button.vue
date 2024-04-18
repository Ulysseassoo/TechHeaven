<script setup lang="ts">
import { ref } from "vue";

defineProps<{ content: string }>();

</script>

<template>
  <v-btn>{{ content }}</v-btn>
</template>
