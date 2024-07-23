<script setup lang="ts">
import BasketPreviewProduct from './BasketPreviewProduct.vue';
import { useBasketStore } from '@/store/basketStore';

const basketStore = useBasketStore()
const { basket, getTotalPriceOfOneProduct, getTotalPrice } = basketStore
</script>

<template>
    <section class="basket-preview-container">
        <div class="basket-preview-data">
            <h3>Panier</h3>
            <p class="basket-preview-data-price">Sous total : {{ getTotalPrice() }} €</p>
            <RouterLink class="router-link" to="/basket">
                <v-btn width="100%" color="#3281ED">Aller au panier</v-btn>
            </RouterLink>
        </div>
        <div class="basket-preview-products">
            <BasketPreviewProduct v-for="product in basket" :key="product.product.id" :product-price="getTotalPriceOfOneProduct(product.product)"  :product-quantity="product.orderQuantity"/>
        </div>
    </section>
</template>

<style scoped>
.basket-preview-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 0 15px;
    border-bottom: 1px solid #909090;
    padding-bottom: 25px;
    margin-bottom: 25px;
}

.basket-preview-data-price {
    font-weight: 600;
}

.basket-preview-products {
    display: flex;
    flex-direction: column;
    gap: 15px;
}
</style>