<script setup lang="ts">
import airpods from "@/assets/airpods.png";
import type { Product } from "@/interfaces/Product";
import { useBasketStore } from "@/store/basketStore";

defineProps<{
  product: Product;
}>();

const basketStore = useBasketStore();
const addProduct = (product: Product) => {
  basketStore.addItemToBasket(product);
};
</script>
<template>
  <div class="more-product-container">
    <img class="more-product-image" :src="airpods" alt="" />
    <h2>{{ product.name }}</h2>
    <p>{{ product.price }} EUR</p>
    <v-btn @click="addProduct(product)" variant="outlined"
      >Ajouter au panier</v-btn
    >
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
