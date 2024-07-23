<script setup lang="ts">
import airpods from "@/assets/airpods.png";
</script>
<template>
  <div class="more-product-container">
    <img class="more-product-image" :src="airpods" alt="" />
    <h2>Airpods Pro Max 2</h2>
    <p>Le prix</p>
    <v-btn variant="outlined">Ajouter au panier</v-btn>
  </div>
</template>
<style scoped>
.more-product-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: white;
  border-radius: 8px;
  padding: 25px 15px;
}
.more-product-image {
  width: 100px;
  object-fit: contain;
}
</style>
