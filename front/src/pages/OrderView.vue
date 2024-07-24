<script lang="ts" setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import OrderContainer from "@/components/Basket/Order/OrderContainer.vue";

import { useUserStore } from "@/store/UserStore";
import router from "@/router";

const useStore = useUserStore();
const { user } = useStore;

if (!user) {
  router.push("/products");
}
</script>
<template>
  <Header />
  <OrderContainer />
  <Footer />
</template>
<style></style>
