<script lang="ts" setup>
import airpods from "@/assets/airpods.png";

defineProps<{
  name: string;
  price: number;
  quantity: number;
}>();
</script>

<template>
  <div class="basket-recap-product-container">
    <div class="basket-recap-product">
      <div class="basket-recap-product-image">
        <img :src="airpods" alt="" />
        <p class="basket-recap-product-quantity">{{ quantity }}</p>
      </div>
      <p class="basket-recap-product-name">{{ name }}</p>
    </div>
    <p class="basket-recap-product-price">{{ price }} €</p>
  </div>
</template>

<style scoped>
.basket-recap-product-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
}

.basket-recap-product {
  display: flex;
  align-items: center;
  gap: 15px;
}

.basket-recap-product-image {
  position: relative;
  width: 70px;
  height: 70px;
  border: solid 1px black;
  padding: 10px;
  border-radius: 4px;
}

.basket-recap-product-image > img {
  object-fit: contain;
  width: 100%;
}

.basket-recap-product-price {
  font-weight: 600;
}

.basket-recap-product-quantity {
  position: absolute;
  top: 0;
  right: 0;
  background: white;
  width: 20px;
  height: 20px;
  border: 1px solid black;
  border-radius: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  transform: translate(50%, -50%);
}
</style>
