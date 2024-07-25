<script setup lang="ts">
import { computed, ref } from "vue";

import User from "@/components/Icons/User.vue";
import Basket from "@/components/Icons/Basket.vue";
import { useUserStore } from "@/store/UserStore";
import { useBasketStore } from "@/store/basketStore";
import { useProductStore } from "@/store/productStore";

import { useWindowSize } from "../hooks/useWindowSize";
const BREAKPOINT_FOR_SEARCHBAR = 820;
const { width } = useWindowSize();

const store = useUserStore();

const basketStore = useBasketStore();
const basketProductCount = computed(() => basketStore.basketProductCount);
const productStore = useProductStore();

const searchBar = ref("");

const handleSubmit = () => {
  productStore.fetchProducts(
    `name=${searchBar.value}&description=${searchBar.value}`,
  );
};
</script>

<template>
  <header>
    <section class="header">
      <RouterLink to="/">
        <img
          width="120px"
          style="object-fit: contain"
          src="../assets/logo.png"
        />
      </RouterLink>
      <div class="search-section">
        <RouterLink class="router-link" to="/products">Nos produits</RouterLink>
        <v-form style="flex: 1" @submit.prevent="handleSubmit">
          <v-text-field
            :style="{
              display: width > BREAKPOINT_FOR_SEARCHBAR ? 'initial' : 'none',
            }"
            variant="outlined"
            label="Qu'est-ce que vous cherchez"
            v-model="searchBar"
            :error="false"
            type="text"
            :hide-details="true"
            density="compact"
            @keyup.enter="handleSubmit"
          />
        </v-form>
      </div>
      <div style="display: flex">
        <RouterLink
          class="router-link"
          :to="
            store.user !== undefined && store.user
              ? '/account/profile'
              : '/login'
          "
        >
          <User />
        </RouterLink>
        <div class="basket-icon">
          <RouterLink class="router-link" to="/basket">
            <Basket v-if="store.user !== undefined && store.user" />
          </RouterLink>
          <p v-if="basketProductCount" class="basket-quantity">
            {{ basketProductCount }}
          </p>
        </div>
      </div>
    </section>
    <section class="search-section-mobile">
      <v-form style="flex: 1" @submit.prevent="handleSubmit">
        <v-text-field
          :style="{
            display: width > BREAKPOINT_FOR_SEARCHBAR ? 'none' : 'initial',
          }"
          variant="outlined"
          label="Qu'est-ce que vous cherchez"
          v-model="searchBar"
          :error="false"
          type="text"
          :hide-details="true"
          density="compact"
          @keyup.enter="handleSubmit"
        />
      </v-form>
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
  @media (max-width: 820px) {
    padding-left: 25px;
    padding-right: 25px;
  }
}

.search-section {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-grow: 1;
  /* @media (max-width: 820px) {
    display: none;
  } */
}

.router-link {
  text-decoration: none;
  color: black;
}

.basket-icon {
  position: relative;
}

.basket-quantity {
  position: absolute;
  top: 0;
  right: -20%;
  width: 15px;
  height: 15px;
  background: red;
  color: white;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
}
</style>
