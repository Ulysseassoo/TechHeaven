<script setup lang="ts">
import CategoryCard from "@/components/Home/CategoryCard.vue";
import { useDisplay } from "vuetify";

import keyboardImage from "@/assets/Home/welcome-new-product-keyboard.avif";

const { xs } = useDisplay();
</script>

<template>
  <section class="section-container" :class="xs ? 'mobile' : null">
    <CategoryCard
      class="section-1"
      :class="xs ? 'mobile' : null"
      name="test"
      :img="keyboardImage"
    />
    <CategoryCard
      class="section-2"
      :class="xs ? 'mobile' : null"
      name="test"
      :img="keyboardImage"
    />
    <CategoryCard
      class="section-3"
      :class="xs ? 'mobile' : null"
      name="test"
      :img="keyboardImage"
    />
  </section>
</template>

<style scoped>
.section-container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(5, 1fr);
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
  grid-area: 1 / 1 / 6 / 3;
}
.section-2 {
  grid-area: 1 / 3 / 6 / 5;
}
.section-3 {
  grid-area: 1 / 5 / 6 / 7;
}

.section-1.mobile,
.section-2.mobile,
.section-3.mobile {
  height: 31.5%;
}
</style>
