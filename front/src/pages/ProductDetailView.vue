<script lang="ts" setup>
import { computed } from "vue";
import { useProductStore } from "@/store/productStore";
import airpodsPng from "@/assets/airpods.png";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

const productStore = useProductStore();
const product = computed(() => productStore.productDetailSelected);
</script>
<template>
  <Header />
  <section class="product-detail-container" v-if="!product">
    Produit inexistant
  </section>
  <section v-else>
    <h1>{{ product.name }}</h1>
    <div class="product-detail-container">
      <div class="product-detail-image">
        <img :src="airpodsPng" alt="" />
      </div>

      <div class="product-detail-informations">
        <div>Description : {{ product.description }}</div>
        <div>Marque : {{ product.brand }}</div>
        <div>Prix : {{ product.price }} EUR</div>
      </div>
    </div>
  </section>
  <Footer />
</template>
<style scoped>
.product-detail-container {
  height: 80vh;
  display: flex;
  align-items: center;
  gap: 50px;
  padding: 0 50px;
}

.product-detail-image {
  width: 40%;
  border: solid 1px black;
  padding: 20px;
  border-radius: 8px;
}

h1 {
  padding: 0 50px;
  margin-top: 50px;
}
</style>
