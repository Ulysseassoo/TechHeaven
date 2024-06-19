<script setup lang="ts">
import ProductCard from "./ProductCard.vue";
import { useDisplay } from "vuetify";

import keyboardImage from "../../assets/Home/welcome-new-product-keyboard.avif";
import Sony from "../../assets/Home/sony.avif";

const { xs } = useDisplay();
</script>

<template>
  <section class="section-container">
    <h1>Nos nouveaux produits</h1>

    <div class="products-container" :class="xs ? 'mobile' : null">
      <div>
        <ProductCard
          name="Clavier logitech G575"
          :img="keyboardImage"
          cta-text="Acheter"
          :is-full-height="true"
        />
      </div>
      <div class="products">
        <ProductCard
          name="Sony"
          :img="Sony"
          cta-text="Acheter"
          :is-full-height="false"
        />
        <ProductCard
          name="Sony"
          :img="Sony"
          cta-text="Acheter"
          :is-full-height="false"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-container {
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

.products-container.mobile {
  flex-direction: column;
}

.products {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
