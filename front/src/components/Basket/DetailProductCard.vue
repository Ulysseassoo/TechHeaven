<script setup lang="ts">
import watch from "@/assets/watch.png"
import type { Product } from "@/interfaces/Product";

import { useBasketStore } from '@/store/basketStore';

const basketStore = useBasketStore()
const { addItemToBasket, decrementItemFromBasket, removeItemFromBasket } = basketStore

defineProps<{
    product: Product,
    quantity: number
}>()
</script>
<template>
    <div class="basket-detail-card">
        <div class="basket-detail-card-image">
            <img :src="watch" alt="">
        </div>        
        <div class="basket-detail-card-description">
            <div>
                <p class="basket-detail-card-name" >{{ product.name }}</p>
                <p class="basket-detail-card-product-description">{{ product.description }}</p>
            </div>
            <div class="basket-detail-card-price">{{ product.price }} EUR</div>
        </div>        
        <div class="basket-detail-actions">
            <div class="basket-detail-actions-quantity">
                <v-btn density="compact" @click="decrementItemFromBasket(product)">-</v-btn>
                {{ quantity }}
                <v-btn density="compact" @click="addItemToBasket(product)">+</v-btn>
            </div>
            <v-btn variant="outlined" color="#BC314A" @click="removeItemFromBasket(product)">Supprimer</v-btn>
        </div>        
    </div>
</template>
<style scoped>
    .basket-detail-card {
        display: flex;
        background: white;
        padding: 15px;
    }

    .basket-detail-card-image {
        width: 200px;
        height: 150px;
        border-radius: 8px;
        margin-right: 15px;
    }

    .basket-detail-card-image > img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .basket-detail-card-description {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .basket-detail-card-name {
        font-weight: 700;
        margin-bottom: 5px;
    }

    .basket-detail-card-product-description {
        color: rgba(0, 0, 0, 0.5);
    }

    .basket-detail-card-price {
        font-weight: 700;
    }

    .basket-detail-actions {
        display: flex;
        align-items: center;
        gap: 15px;
        height: min-content;
    }

    .basket-detail-actions-quantity {
        display: flex;
        gap: 10px;
        align-items: center;
        height: min-content;
    }

</style>