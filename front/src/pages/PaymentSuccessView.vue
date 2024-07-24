<script lang="ts" setup>
import { emptyBasket } from "@/api/basket";
import { useBasketStore } from "@/store/basketStore";
import { useRouter } from "vue-router";

const router = useRouter();

const basketStore = useBasketStore();
await emptyBasket();
basketStore.emptyBasket();
router.push("/");
</script>
<template>
  <div>Loading</div>
</template>
<style scoped></style>
