<script lang="ts" setup>
    import airpods from "@/assets/airpods.png"
    import type { Product } from "@/interfaces/Product";
    import { useBasketStore } from '@/store/basketStore';

    const basketStore = useBasketStore()
    const { addItemToBasket } = basketStore
    defineProps<{
        product: Product
    }>()
</script>
<template>
  <div class="product-card">
    <div class="product-image">
        <img :src="airpods" alt="">
    </div>
    <div class="product-name">
        {{ product.name }}
    </div>
    <div class="product-description">{{ product.description }}</div>
    <div class="product-price">
        <div class="product-price-label">À partir de :</div>
        <div class="product-price-amount">{{ product.price }} EUR</div>
    </div>

    <div class="product-buttons">
        <v-btn color="#F1F2F5"> Voir l'article </v-btn>
        <v-btn  color="#3281ED" @click="addItemToBasket(product)" > Ajouter au panier </v-btn>
    </div>
  </div>
</template>
<style scoped>
    .product-card {
        max-width: 300px;
        display: flex;
        flex-direction: column;
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

</style>
