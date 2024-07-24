<script setup lang="ts">
import { useProductStore } from "@/store/productStore";
import { useBasketStore } from "@/store/basketStore";
import { useUserStore } from "@/store/UserStore";
import { onMounted } from "vue";

const productStore = useProductStore();
const basketStore = useBasketStore();
const userStore = useUserStore();

onMounted(async () => {
  if (userStore.user) {
    productStore.fetchProducts();
    basketStore.fetchBasket();
    basketStore.fetchBasketProducts();
  }
});
</script>

<template>
  <main>
    <RouterView />
  </main>
</template>
