<script setup lang="ts">
import { useProductStore } from "@/store/productStore";
import { useBasketStore } from "@/store/basketStore";
import { useUserStore } from "@/store/UserStore";
import { onMounted, watch } from "vue";

const productStore = useProductStore();
const basketStore = useBasketStore();
const userStore = useUserStore();

const fetchData = async () => {
  await productStore.fetchProducts();
  if (userStore.user) {
    await productStore.fetchProducts();
    await basketStore.fetchBasket();
    await basketStore.fetchBasketProducts();
  }
};

onMounted(fetchData);

watch(() => userStore.user, fetchData);
</script>

<template>
  <main>
    <RouterView />
  </main>
</template>
