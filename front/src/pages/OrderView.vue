<script lang="ts" setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import OrderContainer from "@/components/Basket/Order/OrderContainer.vue";

import { useUserStore } from "@/store/UserStore";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const useStore = useUserStore();
const router = useRouter();
const { user } = useStore;

onMounted(() => {
  if (!user) {
    router.push("/products");
  }

  if (user?.addresses.length === 0) {
    router.push("/");
  }
});
</script>
<template>
  <div v-if="user?.addresses.length !== 0">
    <Header />
    <OrderContainer />
    <Footer />
  </div>
</template>
<style></style>
