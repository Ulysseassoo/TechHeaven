<script setup lang="ts">
import { computed } from "vue"
import BasketDetails from "./BasketDetails.vue";
import BasketRecap from "./BasketRecap.vue";

import { useBasketStore } from "@/store/basketStore";

const basketStore = useBasketStore();
const basket = computed(() => basketStore.basket);
</script>
<template>
  <section class="basket-container">
    <BasketDetails class="basket-details" :basket="basket" />
    <BasketRecap class="basket-recap" />
  </section>
</template>
<style scoped>
.basket-container {
  min-height: 100vh;
  display: flex;
}

.basket-details {
  flex: 3;
}

.basket-recap {
  flex: 2;
}
</style>
