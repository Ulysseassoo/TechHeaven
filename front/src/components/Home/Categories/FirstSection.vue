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
    <CategoryCard
      class="section-4"
      :class="xs ? 'mobile' : null"
      name="test"
      :img="keyboardImage"
    />
    <CategoryCard
      class="section-5"
      :class="xs ? 'mobile' : null"
      name="test"
      :img="keyboardImage"
    />
  </section>
</template>

<style scoped>
.section-container {
  padding: 0;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(5, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  height: 85vh;
  gap: 15px;
  width: 100%;
}
.section-container.mobile {
  display: flex;
  flex-direction: column;
}

.section-1 {
  grid-area: 1 / 1 / 4 / 5;
}
.section-1.mobile {
  height: 18%;
  grid-area: 1 / 1 / 2 / 7;
}

.section-2 {
  grid-area: 4 / 1 / 6 / 3;
}
.section-2.mobile {
  grid-area: 2 / 1 / 3 / 7;
  height: 18%;
}

.section-3 {
  grid-area: 4 / 3 / 6 / 5;
}
.section-3.mobile {
  grid-area: 3 / 1 / 4 / 7;
  height: 18%;
}

.section-4 {
  grid-area: 3 / 5 / 6 / 7;
}
.section-4.mobile {
  grid-area: 4 / 1 / 5 / 7;
  height: 18%;
}

.section-5 {
  grid-area: 1 / 5 / 3 / 7;
}
.section-5.mobile {
  grid-area: 5 / 1 / 6 / 7;
  height: 18%;
}
</style>
