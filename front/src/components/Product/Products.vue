<script setup lang="ts">
import { computed } from 'vue'
import { useProductStore } from '@/store/productStore';
import Product from "./Product.vue"

const productStore = useProductStore()
const products = computed(() => productStore.products)

</script>

<template>
    <section class="products-container">
        <Product v-for="product in products" :key="product.id" :product="product"/>
    </section>
</template>

<style scoped>
    .products-container {
        background-color: #F8F9FC;
        display: flex;
        gap: 50px;
        flex-wrap: wrap;
        padding: 40px;
    }
</style>