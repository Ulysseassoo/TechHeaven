<script lang="ts" setup>
import { useProductStore } from "@/store/productStore";
import { ref } from "vue";

const productStore = useProductStore();
const maxPrice = ref(null);
const brand = ref(null);
const category = ref(null);

const handleSubmit = () => {
  productStore.fetchProducts(
    `maxPrice=${maxPrice.value}&brand=${brand.value}&category=${category.value}`
  );
};
</script>
<template>
  <div>
    <h1>Filtre produit :</h1>

    <v-form style="padding: 20px" @submit.prevent="handleSubmit">
      <v-text-field
        variant="outlined"
        label="Prix maximum"
        v-model="maxPrice"
        :error="false"
        type="number"
        :hide-details="true"
        density="compact"
        @keyup.enter="handleSubmit"
      />
    </v-form>

    <v-form style="padding: 20px" @submit.prevent="handleSubmit">
      <v-text-field
        variant="outlined"
        label="Catégorie"
        v-model="category"
        :error="false"
        type="text"
        :hide-details="true"
        density="compact"
        @keyup.enter="handleSubmit"
      />
    </v-form>

    <v-form style="padding: 20px" @submit.prevent="handleSubmit">
      <v-text-field
        variant="outlined"
        label="Marque"
        v-model="brand"
        :error="false"
        type="text"
        :hide-details="true"
        density="compact"
        @keyup.enter="handleSubmit"
      />
    </v-form>
  </div>
</template>
<style scoped>
h1 {
  padding: 10px 20px;
  font-size: 16px;
}
</style>
