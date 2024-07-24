<script setup lang="ts">
import { computed } from "vue";
import OrderRecap from "./OrderRecap.vue";
import OrderForm from "./OrderForm.vue";

import { useBasketStore } from "@/store/basketStore";

const basketStore = useBasketStore();
const basket = computed(() => basketStore.basket);
</script>
<template>
  <section class="order-container">
    <OrderForm class="order-form" />
    <OrderRecap class="order-recap" />
  </section>
</template>
<style scoped>
.order-container {
  min-height: 100vh;
  display: flex;
}

.order-form {
  flex: 3;
}

.order-recap {
  flex: 2;
}
</style>
