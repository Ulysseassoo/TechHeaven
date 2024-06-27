<script setup lang="ts">
import Button from "@/components/Button.vue";
import { useDisplay } from "vuetify";

defineProps<{
  name: string;
  img: string;
  ctaText: string;
  isFullHeight?: boolean;
}>();

const { xs } = useDisplay();
</script>

<template>
  <div class="container" :class="isFullHeight ? 'full-height' : 'half-height'">
    <img class="product-image" :src="img" alt="image of the product" />
    <div class="product-details" :class="xs ? 'mobile' : null">
      <p class="product-details-name">{{ name }}</p>
      <Button class="product-details-cta" content="Acheter">{{ ctaText }}</Button>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  border-radius: 5px;
  overflow: hidden;
}
.full-height {
  height: 100%;
}
.half-height {
  height: 50%;
}
.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.product-details {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-top: 50px;
  padding-bottom: 50px;
}
.product-details.mobile {
  padding-top: 15px;
  padding-bottom: 15px;
}
.product-details-name {
  font-size: 35px;
  text-align: center;
  font-weight: 600;
}
.product-details-cta {
  width: min-content;
}
</style>
