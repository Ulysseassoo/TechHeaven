<script setup lang="ts">
import Products from "./Products.vue";
import BasketPreview from "./../Basket/BasketPreview.vue";
</script>

<template>
  <section class="products-container">
    <section class="product-filter"></section>
    <Products class="" />
    <BasketPreview class="" />
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
