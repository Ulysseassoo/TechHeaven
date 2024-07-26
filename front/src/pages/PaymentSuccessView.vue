<script lang="ts" setup>
import { emptyBasket } from "@/api/basket";
import { useBasketStore } from "@/store/basketStore";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { createOrder } from "@/api/order";
import { createInvoice } from "@/api/invoice";

const router = useRouter();

const basketStore = useBasketStore();

onMounted(async () => {
  try {
    const order = await createOrder();
    await createInvoice(order.data.id);
    await emptyBasket();
    await basketStore.emptyBasket();
    await router.push("/account/orders");
  } catch (err) {
    console.error(err);
  }
});
</script>
<template>
  <div>Loading</div>
</template>
<style scoped></style>
