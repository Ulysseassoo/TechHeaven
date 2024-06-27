<script setup lang="ts">
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import FeedbackCard from "./FeedbackCard.vue";
import { useDisplay } from "vuetify";

import instagramImage from "@/assets/Home/instagram.png";
import jblImage from "@/assets/Home/jbl.png";
import samsungImage from "@/assets/Home/samsung.png";

const { xs } = useDisplay();

const feedbacksMock = [
  {
    description: "Le site est incroyable, je recommande ce service à tout le monde",
    img: instagramImage,
    date: "12 juin",
  },
  {
    description: "Le site est incroyable, je recommande ce service à tout le monde",
    img: jblImage,
    date: "14 juin",
  },
  {
    description: "Le site est incroyable, je recommande ce service à tout le monde",
    img: samsungImage,
    date: "19 Juillet",
  },
  {
    description: "Le site est incroyable, je recommande ce service à tout le monde",
    img: instagramImage,
    date: "12 juin",
  },
  {
    description: "Le site est incroyable, je recommande ce service à tout le monde",
    img: jblImage,
    date: "14 juin",
  },
  {
    description: "Le site est incroyable, je recommande ce service à tout le monde",
    img: samsungImage,
    date: "19 Juillet",
  },
];
</script>

<template>
  <section class="container">
    <h1>Ils parlent de nous !</h1>
    <div>
      <carousel class="slides-container" :items-to-show="xs ? 1 : 3">
        <slide v-for="(feedback, index) in feedbacksMock" :key="index">
          <FeedbackCard
            :description="feedback.description"
            :img="feedback.img"
            :date="feedback.date"
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
