<script setup lang="ts">
import ProductCard from "./ProductCard.vue";
</script>

<template>
  <section class="section-container">
    <h1>Nos nouveaux produits</h1>

    <div class="products-container">
      <div>
        <ProductCard
          name="Clavier logitech G575"
          img="src/assets/Home/welcome-new-product-keyboard.avif"
          cta-text="Acheter"
          :is-full-height="true"
        />
      </div>
      <div class="products">
        <ProductCard
          name="Sony"
          img="src/assets/Home/sony.avif"
          cta-text="Acheter"
          :is-full-height="false"
        />
        <ProductCard
          name="Sony"
          img="src/assets/Home/sony.avif"
          cta-text="Acheter"
          :is-full-height="false"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-container {
  height: 100vh;
  padding: 25px;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
}

.products-container {
  flex: auto;
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.products {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
