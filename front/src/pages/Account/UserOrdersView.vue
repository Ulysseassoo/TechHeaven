<script setup lang="ts">
import { getUserOrders } from "@/api/order";
import type { Order } from "@/interfaces/Order";
import { useUserStore } from "@/store/UserStore";
import OrderCard from "@/components/Account/OrderCard.vue";
import { ref, onMounted } from "vue";

const orders = ref<Order[]>([]);

const store = useUserStore();

const fetchOrders = async () => {
  const response = await getUserOrders({ userId: store?.user?.id });
  orders.value = response.data;
};

onMounted(() => fetchOrders());
</script>

<template>
  <div class="container">
    <p class="text-h4">Commandes</p>
    <v-container>
      <v-row class="gap-y-6 md:gap-y-7 md:mt-7">
        <v-col v-for="order in orders" :key="order.id" cols="12">
          <OrderCard :order="order" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
