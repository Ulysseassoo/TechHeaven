<script setup lang="ts">
defineProps<{
  content: string;
  containerClass: string;
}>();
</script>

<template>
  <div :class="containerClass" style="position: relative">
    <p
      style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 0.1rem 0.5rem;
        z-index: 10;
        background: #f8f9fc;
      "
    >
      {{ content }}
    </p>
    <VDivider class="border-opacity-100"></VDivider>
  </div>
</template>
