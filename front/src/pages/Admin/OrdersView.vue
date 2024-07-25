<script setup lang="ts">
import { onMounted } from "vue";
import type { TableColumn } from "@/interfaces/Table";
import type { Order } from "@/interfaces/Order";
import { useGetPagination } from "@/hooks/useGetPagination";
import { getOrders } from "@/api/order";
import DataTable from "@/components/DataTable.vue";

const columns: TableColumn<Order>[] = [
  { value: "id", label: "Numéro de commande" },
  {
    value: "created_at",
    label: "Date de création",
    renderCell: (row) => new Date(row.created_at).toLocaleString("fr-FR"),
  },
  { value: "status", label: "Status" },
  {
    value: "total_amount",
    label: "Total",
    renderCell: (row) => row.total_amount.toFixed(2) + " €",
  },
  {
    value: "order_details",
    label: "Nombre d'article achetées",
    renderCell: (row) => row.order_details.length,
  },
];

const {
  changeItemsPerPage,
  data,
  search,
  debouncedSearch,
  itemsPerPage,
  totalCount,
  totalPages,
  page,
  loading,
  changeCurrentPage,
  fetchData,
} = useGetPagination<Order>({
  getData: getOrders,
});

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="container">
    <h1>Commandes</h1>
    <DataTable
      :columns="columns"
      :data="data"
      :actions="[]"
      :itemsPerPage="itemsPerPage"
      @update:itemsPerPage="changeItemsPerPage"
      @update:currentPage="changeCurrentPage"
      :totalCount="totalCount"
      :currentPage="page"
      :totalPages="totalPages"
      :isLoading="loading"
    >
      <template v-slot:header>
        <v-text-field
          prepend-inner-icon="fa-solid fa-magnifying-glass"
          density="compact"
          label="Rechercher une commande"
          variant="solo"
          hide-details
          single-line
          style="max-width: 300px"
          v-model="search"
          @input="debouncedSearch"
        ></v-text-field>
        <!-- <ProductModal
          v-if="store?.user?.role === 'ROLE_ADMIN'"
          btnContent="Nouveau produit"
          color="tertiary"
          type="create"
          :callback="() => fetchData()"
        /> -->
      </template>
    </DataTable>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;
}
h1 {
  font-size: 1.6rem;
  margin-bottom: 1em;
}
</style>
