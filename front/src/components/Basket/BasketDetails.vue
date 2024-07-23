<script setup lang="ts">
import BasketMoreProduct from "./BasketMoreProduct.vue";
import DetailProductCard from "./DetailProductCard.vue";
import BasketAdvantage from "./BasketAdvantage.vue";
import type { Basket } from "@/interfaces/Basket";

defineProps<{
  basket: Basket;
}>();
</script>
<template>
  <section class="basket-detail-container">
    <div class="basket-detail-products">
      <h1>Détail du panier</h1>
      <div class="basket-details">
        <h2 style="color: rgba(0, 0, 0, 0.5)" v-if="!basket.length">
          Vous n'avez encore rien sélectionné comme produit.
        </h2>
        <DetailProductCard
          v-else
          v-for="basketProduct in basket"
          :key="basketProduct.product.id"
          :product="basketProduct.product"
          :quantity="basketProduct.orderQuantity"
        />
      </div>
    </div>
    <div class="basket-detail-more">
      <h1>Compléter votre panier</h1>
      <div class="basket-more-products">
        <BasketMoreProduct />
        <BasketMoreProduct />
        <BasketMoreProduct />
      </div>
    </div>
    <div class="basket-detail-advantages">
      <h1>Vos avantages à chaque achats :</h1>
      <BasketAdvantage />
    </div>
  </section>
</template>
<style scoped>
.basket-detail-container {
  padding: 40px 40px;
  background-color: #f8f9fc;
  min-height: 100vh;
}

.basket-detail-products {
  border-bottom: solid 1px rgba(0, 0, 0, 0.5);
}

.basket-detail-more {
  border-bottom: solid 1px rgba(0, 0, 0, 0.5);
  padding: 50px 0;
}

.basket-detail-advantages {
  padding-top: 50px;
}

.basket-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

h1 {
  margin-bottom: 25px;
  font-size: 25px;
}

.basket-more-products {
  display: flex;
  gap: 25px;
}
</style>
