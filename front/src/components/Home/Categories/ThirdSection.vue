<script setup lang="ts">
import CategoryCard from "@/components/Home/CategoryCard.vue";
import { useDisplay } from "vuetify";

import keyboardImage from "@/assets/Home/welcome-new-product-keyboard.avif";

const { xs } = useDisplay();
const isMobileStyle = xs ? "mobile" : null;
</script>

<template>
  <section class="section-container" :class="isMobileStyle">
    <CategoryCard
      :link="`/products?category=test`"
      class="section-1"
      :class="isMobileStyle"
      name="test"
      :img="keyboardImage"
    />
    <CategoryCard
      :link="`/products?category=test`"
      class="section-2"
      :class="isMobileStyle"
      name="test"
      :img="keyboardImage"
    />
    <CategoryCard
      :link="`/products?category=test`"
      class="section-3"
      :class="isMobileStyle"
      name="test"
      :img="keyboardImage"
    />
  </section>
</template>

<style scoped>
.section-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(6, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  height: 85vh;
  gap: 15px;
}

.section-container.mobile {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.section-1 {
  grid-area: 4 / 1 / 7 / 3;
}
.section-2 {
  grid-area: 1 / 1 / 4 / 3;
}
.section-3 {
  grid-area: 1 / 3 / 7 / 6;
}

.section-1.mobile,
.section-2.mobile,
.section-3.mobile {
  height: 31.5%;
}
</style>
