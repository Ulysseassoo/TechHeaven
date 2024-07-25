<script setup lang="ts">
import Header from "@/components/Header.vue";
import ProductContainer from "@/components/Product/ProductContainer.vue";
import Footer from "@/components/Footer.vue";
</script>

<template>
  <Header />
  <ProductContainer />
  <Footer />
</template>

<style scoped>
.products-container {
  min-height: 100vh;
}
</style>
