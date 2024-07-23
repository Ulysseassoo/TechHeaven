<script setup lang="ts">
import CreateAddressCard from "@/components/Account/CreateAddressCard.vue";
import AddressCard from "@/components/Account/AddressCard.vue";
import { useUserStore } from "@/store/UserStore";

const store = useUserStore();
</script>
<template>
  <div class="container">
    <p class="text-h4">Adresses</p>
    <v-container>
      <v-row class="gap-y-6 md:gap-y-7 md:mt-7">
        <v-col style="width: fit-content">
          <CreateAddressCard />
        </v-col>
        <v-col
          cols="12"
          sm="4"
          v-for="address in store.user?.addresses"
          :key="address.id"
        >
          <AddressCard :address="address" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
