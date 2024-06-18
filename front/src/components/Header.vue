<script setup lang="ts">
import { ref } from "vue";

import User from "../components/Icons/User.vue";
import Basket from "../components/Icons/Basket.vue";

const searchBar = ref(null);
</script>

<template>
  <header class="header">
    <section>
      <img width="120px" style="object-fit: contain" src="../assets/logo.png" />
    </section>
    <section class="search-section">
      <RouterLink class="router-link" to="/register"
        >Qui sommes nous ?</RouterLink
      >
      <RouterLink class="router-link" to="/register">Nos produits</RouterLink>
      <VTextField
        variant="outlined"
        label="Qu'est ce que vous cherchez"
        v-model="searchBar"
        :error="false"
        type="input"
        :hide-details="true"
        density="compact"
      ></VTextField>
    </section>
    <section style="display: flex">
      <User />
      <Basket />
    </section>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  width: 100vw;
  justify-content: space-between;
  padding-left: 50px;
  padding-right: 50px;
  align-items: center;
  gap: 25px;
  padding-top: 15px;
  padding-bottom: 15px;
}

.search-section {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-grow: 1;
}

.router-link {
  text-decoration: none;
  color: black;
}
</style>
