<script setup lang="ts">
import { ref } from "vue";

import User from "@/components/Icons/User.vue";
import Basket from "@/components/Icons/Basket.vue";

import { useWindowSize } from "../hooks/useWindowSize";
const BREAKPOINT_FOR_SEARCHBAR = 820;
const { width } = useWindowSize();

const searchBar = ref(null);
</script>

<template>
  <header>
    <section class="header">
      <div>
        <img
          width="120px"
          style="object-fit: contain"
          src="../assets/logo.png"
        />
      </div>
      <div class="search-section">
        <RouterLink class="router-link" to="/register"
          >Qui sommes nous ?</RouterLink
        >
        <RouterLink class="router-link" to="/register">Nos produits</RouterLink>
        <VTextField
          :style="{
            display: width > BREAKPOINT_FOR_SEARCHBAR ? 'initial' : 'none',
          }"
          variant="outlined"
          label="Qu'est ce que vous cherchez"
          v-model="searchBar"
          :error="false"
          type="input"
          :hide-details="true"
          density="compact"
        />
      </div>
      <section style="display: flex">
        <RouterLink class="router-link" to="/account/profile">
          <User />
        </RouterLink>
        <Basket />
      </section>
    </section>
    <section class="search-section-mobile">
      <VTextField
        :style="{
          display: width > BREAKPOINT_FOR_SEARCHBAR ? 'none' : 'initial',
        }"
        variant="outlined"
        label="Qu'est ce que vous cherchez"
        v-model="searchBar"
        :error="false"
        type="input"
        :hide-details="true"
        density="compact"
      />
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
