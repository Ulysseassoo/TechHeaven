<script lang="ts" setup>
import airpods from "@/assets/airpods.png";

defineProps<{
  productPrice?: number;
  productQuantity: number;
}>();
</script>

<template>
  <div class="basket-preview-product-container">
    <img class="basket-preview-product-image" :src="airpods" alt="" />
    <p class="basket-preview-product-price">{{ productPrice }} €</p>
    <p v-if="productQuantity" class="basket-preview-product-quantity">{{ productQuantity }}</p>
  </div>
</template>

<style scoped>
.basket-preview-product-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  border: 1px solid #909090;
  width: 80%;
  margin: auto;
  padding: 20px;
  position: relative;
  border-radius: 5px;
}
.basket-preview-product-image {
  width: 100px;
  object-fit: contain;
}
.basket-preview-product-price {
  font-weight: 600;
}

.basket-preview-product-quantity {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #3281ed;
  color: white;
  width: 25px;
  height: 25px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  transform: translate(50%, -50%);
}
</style>
