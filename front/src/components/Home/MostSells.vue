<script setup lang="ts">
import ProductCard from "./ProductCard.vue";
import { useDisplay } from "vuetify";

const { xs } = useDisplay();
</script>

<template>
  <section class="section-container">
    <h1>Nos produits les plus vendus</h1>

    <div class="products-container" :class="xs ? 'mobile' : null">
      <ProductCard
        style="flex: 1"
        name="Clavier logitech G575"
        img="src/assets/Home/welcome-new-product-keyboard.avif"
        cta-text="Acheter"
        :is-full-height="true"
      />
      <ProductCard
        style="flex: 1"
        name="Clavier logitech G575"
        img="src/assets/Home/welcome-new-product-keyboard.avif"
        cta-text="Acheter"
        :is-full-height="true"
      />
    </div>
  </section>
</template>

<style scoped>
.section-container {
  padding: 25px;
  display: flex;
  flex-direction: column;
}

.products-container {
  flex: auto;
  display: flex;
  gap: 15px;
  margin-top: 20px;
  padding-bottom: 0;
}
.products-container.mobile {
  flex-direction: column;
}

.products {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
