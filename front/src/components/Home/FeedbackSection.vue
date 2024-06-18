<script setup lang="ts">
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import FeedbackCard from "./FeedbackCard.vue";
</script>

<template>
  <section class="container">
    <h1>Ils parlent de nous !</h1>
    <div>
      <carousel class="slides-container" :items-to-show="3">
        <slide v-for="slide in 10" :key="slide">
          <FeedbackCard
            description="Le site est incroyable, je recommande ce service à tout le monde"
            img="src/assets/Home/instagram.png"
            date="12 Juin"
          />
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
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}
</style>
