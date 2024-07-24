<script setup lang="ts">
import { OrderStatus, type Order } from "@/interfaces/Order";
import moment from "moment";

interface Props {
  order: Order;
}

defineProps<Props>();
</script>

<template>
  <v-card variant="outlined" class="card-custom">
    <v-card-title class="bg-grey-lighten-3">
      <div class="d-flex justify-space-between normal-box">
        <div class="d-flex ga-8">
          <div class="d-flex flex-column ga-1">
            <p class="text-subtitle-1">Commande effectuée le</p>
            <p class="text-subtitle-1">
              {{ moment(order.created_at).format("DD MMMM YYYY") }}
            </p>
          </div>

          <div class="d-flex flex-column ga-1">
            <p class="text-subtitle-1">Total</p>
            <p class="text-subtitle-1">{{ order.total_amount }} €</p>
          </div>
        </div>

        <div>
          <p class="text-subtitle-2">Commande # {{ order.id }}</p>
        </div>
      </div>
    </v-card-title>
    <v-card-item class="item">
      <p class="text-h6">
        {{
          order.status === OrderStatus.COMPLETED
            ? "Livré : 19 Juillet"
            : `Livraison ${OrderStatus.PENDING}`
        }}
      </p>
      <div v-for="item in order.order_details" :key="item.id" class="mb-4">
        <div class="d-flex justify-space-between">
          <div class="d-flex flex-column">
            <RouterLink
              :to="`/products/${item.product_id}`"
              class="text-subtitle-1 text-primary"
              >{{ item.product_name }}</RouterLink
            >
            <p class="text-subtitle-2">{{ item.product_description }}</p>
            <p class="text-subtitle-2">Quantité : {{ item.quantity }}</p>
          </div>
        </div>
      </div>
    </v-card-item>

    <v-card-actions> </v-card-actions>
  </v-card>
</template>

<style scoped>
.card-custom {
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.875rem;
  background: white;
  @media (max-width: 700px) {
    width: 100%;
    overflow-y: scroll;
  }
}

.normal-box {
  @media (max-width: 700px) {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
