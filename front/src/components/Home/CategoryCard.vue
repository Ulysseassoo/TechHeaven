<script setup lang="ts">
defineProps<{
  img: string;
  name: string;
  link: string;
}>();
</script>

<template>
  <RouterLink :to="link" class="category-container">
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
  </RouterLink>
</template>

<style scoped>
.category-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  text-decoration: none;
  color: black;
  transition: opacity 0.3s ease;
  &:hover {
    opacity: 0.8;
  }
}
</style>
