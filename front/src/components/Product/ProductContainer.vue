<script setup lang="ts">
import Products from "./Products.vue";
import BasketPreview from "./../Basket/BasketPreview.vue";

import { useUserStore } from "@/store/UserStore";

const useStore = useUserStore();
const { user } = useStore;
</script>

<template>
  <section class="products-container">
    <section class="product-filter"></section>
    <Products class="" />
    <BasketPreview v-if="user" class="" />
  </section>
</template>

<style scoped>
.products-container {
  display: flex;
}

.product-filter {
  width: 500px;
}
</style>
