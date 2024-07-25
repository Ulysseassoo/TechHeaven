<script lang="ts" setup>
import airpods from "@/assets/airpods.png";
import type { Product } from "@/interfaces/Product";
import { useBasketStore } from "@/store/basketStore";
import { useUserStore } from "@/store/UserStore";
import { useProductStore } from "@/store/productStore";
import { useRouter } from "vue-router";

const basketStore = useBasketStore();
const userStore = useUserStore();
const productStore = useProductStore();
const router = useRouter();
const { user } = userStore;
const { addItemToBasket } = basketStore;
defineProps<{
  product: Product;
}>();

const goDetailPage = (product: Product) => {
  productStore.setSelectedProduct(product);
  router.push("/product-detail");
};
</script>
<template>
  <div class="product-card">
    <div class="product-card-informations">
      <div class="product-image">
        <img :src="airpods" alt="" />
      </div>
      <div class="product-name">{{ product.name }}</div>
      <div class="product-description">{{ product.description }}</div>
      <div class="product-price">
        <div class="product-price-label">À partir de :</div>
        <div class="product-price-amount">{{ product.price }} EUR</div>
      </div>
    </div>

    <div class="product-buttons">
      <v-btn @click="goDetailPage(product)" color="#F1F2F5">
        Voir l'article
      </v-btn>
      <v-btn
        v-if="user && product.quantity > 0"
        color="#3281ED"
        @click="addItemToBasket(product)"
      >
        Ajouter au panier
      </v-btn>
      <p class="product-buttons-connection" v-else-if="product.quantity == 0">
        Victime de son succès
      </p>
      <p class="product-buttons-connection" v-else>
        Vueillez vous connecter pour ajouter au panier
      </p>
    </div>
  </div>
</template>
<style scoped>
.product-card {
  max-width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: white;
  padding: 15px 15px;
  border-radius: 5px;
}

.product-image {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}

.product-image > img {
  width: 50%;
  object-fit: contain;
}

.product-name {
  margin-top: 15px;
  font-weight: 700;
}

.product-description {
  font-size: 12px;
  color: #646464;
  margin-left: 8px;
}

.product-price {
  margin-top: 10px;
}

.product-price-label {
  color: #929292;
  font-weight: 600;
  font-size: 18px;
}

.product-price-amount {
  font-weight: 700;
}

.product-buttons {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-buttons-connection {
  font-size: 12px;
  text-align: center;
}
</style>
