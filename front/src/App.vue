<script setup lang="ts">
import { onMounted } from "vue";
import { useProductStore } from "@/store/productStore";

const productStore = useProductStore();

onMounted(() => {
  productStore.fetchProducts();
});
</script>

<template>
  <main>
    <RouterView />
  </main>
</template>
