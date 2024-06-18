<script setup lang="ts">
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import FirstSection from "./Categories/FirstSection.vue";
import SecondSection from "./Categories/SecondSection.vue";
import ThirdSection from "./Categories/ThirdSection.vue";
</script>

<template>
  <section class="container">
    <h1 style="margin-bottom: 20px">Nos catégories</h1>
    <div class="carousel-container">
      <carousel :items-to-show="1" :wrap-around="true">
        <slide key="slide">
          <FirstSection />
        </slide>

        <slide key="slide">
          <SecondSection />
        </slide>

        <slide key="slide">
          <ThirdSection />
        </slide>

        <template #addons>
          <navigation />
          <pagination />
        </template>
      </carousel>
    </div>
  </section>
</template>

<style scoped>
.container {
  padding: 0 25px;
  margin: 30px 0;
}
</style>
