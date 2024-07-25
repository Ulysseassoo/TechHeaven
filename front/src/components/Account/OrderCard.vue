<script setup lang="ts">
import { OrderStatus, type Order } from "@/interfaces/Order";
import type { Product } from "@/interfaces/Product";
import moment from "moment";
import { useProductStore } from "@/store/productStore";
import { useRouter } from "vue-router";

const productStore = useProductStore();
const router = useRouter();

interface Props {
  order: Order;
}

const goDetailPage = (product: Product) => {
  productStore.setSelectedProduct(product);
  router.push("/product-detail");
};

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
            <p
              @click="
                goDetailPage({
                  id: item.product_id,
                  name: item.product_name,
                  description: item.product_description,
                  brand: 'ee',
                  promotion: null,
                  promotion_type: null,
                  price: item.unit_price,
                  quantity: item.quantity,
                  category: undefined,
                  categoryId: null,
                })
              "
              class="text-subtitle-1 text-primary cursor-pointer"
            >
              {{ item.product_name }}
            </p>
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
