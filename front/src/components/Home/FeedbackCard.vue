<script setup lang="ts">
defineProps<{
  description: string;
  img: string;
  date: string;
}>();
</script>

<template>
  <div class="card">
    <p>
      {{ description }}
    </p>
    <img
      style="width: 25px; height: 25px; object-fit: contain"
      :src="img"
      alt="the image of the feedback's company"
    />
    <p>
      {{ date }}
    </p>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 25px 35px;
  margin: 0 10px;
  border-radius: 5px;
}
</style>
