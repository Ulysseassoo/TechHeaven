<script lang="ts" setup>
import { emptyBasket } from "@/api/basket";
import { useBasketStore } from "@/store/basketStore";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const basketStore = useBasketStore();

onMounted(async () => {
  await emptyBasket();
  basketStore.emptyBasket();
  router.push("/account/orders");
});
</script>
<template>
  <div>Loading</div>
</template>
<style scoped></style>
