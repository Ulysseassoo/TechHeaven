<script setup lang="ts">
import { computed } from "vue";
import BasketRecapProduct from "./../BasketRecapProduct.vue";
import { useBasketStore } from "@/store/basketStore";
import { getPaymentLink } from "@/api/payment";

const basketStore = useBasketStore();
const basketProducts = computed(() => basketStore.basket);

const goOrderPage = async () => {
  try {
    const paymentLink = await getPaymentLink();
    window.location.replace(paymentLink.data.link);
  } catch (error) {
    throw error;
  }
};
</script>
<template>
  <section class="basket-recap-container">
    <h1>Récapitulatif</h1>

    <div class="basket-recap-card">
      <BasketRecapProduct
        v-for="basketProduct in basketProducts"
        :key="basketProduct.product.id"
        :name="basketProduct.product.name"
        :price="basketProduct.product.price * basketProduct.orderQuantity"
        :quantity="basketProduct.orderQuantity"
      />

      <div class="recap-delivery-price">
        <p>Livraison</p>
        <p>Gratuite</p>
      </div>

      <div class="recap-price-details">
        <div class="recap-price-subtotal">
          <p>Total avant TVA</p>
          <p>{{ (basketStore.getTotalPrice() * 0.8).toFixed(2) }} EUR</p>
        </div>
        <div class="recap-price-fee">
          <p>TVA en France</p>
          <p>{{ (basketStore.getTotalPrice() * 0.2).toFixed(2) }} EUR</p>
        </div>
      </div>

      <div class="recap-price-total">
        <p>Total</p>
        <p>{{ basketStore.getTotalPrice().toFixed(2) }} EUR</p>
      </div>

      <v-btn @click="goOrderPage" class="recap-cta" color="#3281ED"
        >Passer au paiement</v-btn
      >
    </div>
  </section>
</template>
<style scoped>
.basket-recap-container {
  background: #f1f1f1;
  padding: 40px;
}

h1 {
  margin-bottom: 25px;
  font-size: 25px;
}

.basket-recap-card {
  background: white;
  border-radius: 5px;
  padding: 15px;
}

.recap-price-total,
.recap-price-details,
.recap-delivery-price {
  font-weight: 500;
}

.recap-price-subtotal,
.recap-price-total,
.recap-price-fee,
.recap-delivery-price {
  display: flex;
  justify-content: space-between;
}

.recap-price-details {
  border-top: solid 1px black;
  border-bottom: solid 1px black;
  padding: 20px 0;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recap-cta {
  width: 100%;
  margin-top: 20px;
}
</style>
