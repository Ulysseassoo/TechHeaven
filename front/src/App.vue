<script setup lang="ts">
import { useProductStore } from "@/store/productStore";
import { useBasketStore } from "@/store/basketStore";

const productStore = useProductStore();
const basketStore = useBasketStore();

productStore.fetchProducts();
basketStore.fetchBasket();
basketStore.fetchBasketProducts();
</script>

<template>
  <main>
    <RouterView />
  </main>
</template>
