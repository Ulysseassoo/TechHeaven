<script setup lang="ts">
import Products from "./Products.vue";
import BasketPreview from "./../Basket/BasketPreview.vue";
import ProductFilter from "./ProductFilter.vue";

import { useUserStore } from "@/store/UserStore";

const useStore = useUserStore();
const { user } = useStore;
</script>

<template>
  <section class="products-container">
    <ProductFilter class="product-filter" />
    <Products class="product-section" />
    <BasketPreview v-if="user" class="" />
  </section>
</template>

<style scoped>
.products-container {
  display: flex;
}

.product-filter {
  flex: 1;
}

.product-section {
  flex: 4;
}
</style>
