<script setup lang="ts">
import OrderRecap from "./OrderRecap.vue";
import OrderForm from "./OrderForm.vue";
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
