<script setup lang="ts">
import { getUserOrders } from "@/api/order";
import type { Order } from "@/interfaces/Order";
import { useUserStore } from "@/store/UserStore";
import OrderCard from "@/components/Account/OrderCard.vue";
import { ref, onMounted } from "vue";
import { useDebounce } from "@/hooks/useDebounce";

const orders = ref<Order[]>([]);
const search = ref("");
const loading = ref(true);

const store = useUserStore();

const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await getUserOrders({
      userId: store?.user?.id,
      search: search.value !== "" ? search.value : undefined,
    });
    orders.value = response.data;
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
  }
};

const debouncedSearchOrders = useDebounce(fetchOrders, 500);

onMounted(() => fetchOrders());
</script>

<template>
  <div class="container">
    <p class="text-h4">Commandes</p>
    <v-container>
      <v-text-field
        prepend-inner-icon="fa-solid fa-magnifying-glass"
        density="compact"
        label="Rechercher dans toutes les commandes"
        variant="solo"
        single-line
        v-model="search"
        hint="Vous pouvez rechercher par titre de produit, numéro de commande."
        persistent-hint
        @input="
          () => {
            loading = true;
            debouncedSearchOrders();
          }
        "
        style="width: 100%"
      ></v-text-field>
      <v-row class="gap-y-6 md:gap-y-7 mt-7">
        <v-col v-if="loading">
          <v-skeleton-loader :elevation="2" type="card"></v-skeleton-loader>
        </v-col>
        <v-col v-else-if="orders.length === 0 && search === ''">
          Vous n'avez aucune commande.
        </v-col>
        <v-col v-else-if="orders.length === 0 && search !== ''">
          Aucun résultat trouvé. Vuillez essayer une autre recherche.
        </v-col>
        <v-col v-else v-for="order in orders" :key="order.id" cols="12">
          <OrderCard :order="order" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
