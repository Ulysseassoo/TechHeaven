<script setup lang="ts">
defineProps<{
  img: string;
  name: string;
}>();
</script>

<template>
  <div class="category-container">
    <img style="width: 100%; height: 100%; object-fit: cover" :src="img" />
    <div
      style="
        background: white;
        text-align: center;
        padding: 5px 0;
        font-weight: 500;
      "
    >
      {{ name }}
    </div>
  </div>
</template>

<style scoped>
.category-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
}
</style>
