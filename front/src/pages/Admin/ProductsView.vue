<script setup lang="ts">
import { h, onMounted } from "vue";
import type { TableColumn } from "@/interfaces/Table";
import type { Product } from "@/interfaces/Product";
import { useGetPagination } from "@/hooks/useGetPagination";
import { deleteProduct, getProducts } from "@/api/product";
import { toast, type ToastOptions } from "vue3-toastify";
import DataTable from "@/components/DataTable.vue";
import ModalButton from "@/components/ModalButton.vue";
import ProductModal from "@/components/Admin/ProductModal.vue";
import { useUserStore } from "@/store/UserStore";

const store = useUserStore();
const columns: TableColumn<Product>[] = [
  { value: "name", label: "Nom" },
  { value: "description", label: "Description" },
  { value: "brand", label: "Marque" },
  { value: "quantity", label: "Quantité" },
  {
    value: "price",
    label: "Prix",
    renderCell: (row) => row.price.toFixed(2) + " €",
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
} = useGetPagination<Product>({
  getData: getProducts,
});

const isAdmin = store?.user?.role === "ROLE_ADMIN";

const actions = [
  {
    label: "Voir",
    id: "view",
    icon: "fa-solid fa-eye",
    renderCell: (row: Product) =>
      h(ProductModal, {
        product: row,
        type: "detail",
        icon: "fa-solid fa-eye",
        tooltipLabel: "Voir",
      }),
  },
  {
    label: "Modifier",
    id: "edit",
    renderCell: (row: Product) =>
      h(ProductModal, {
        product: row,
        type: "edit",
        icon: "fa-solid fa-pen",
        tooltipLabel: "Modifier",
        callback: () => fetchData(),
      }),
  },
  {
    label: "Supprimer",
    id: "delete",
    renderCell: (row: Product) =>
      isAdmin
        ? h("div", [
            h(ModalButton, {
              icon: "fa-solid fa-trash",
              tooltipLabel: "Supprimer",
              action: async () => {
                try {
                  const response = await deleteProduct(row.id);
                  if (response.message !== undefined) {
                    toast.success(response.message, {
                      autoClose: 2000,
                      position: toast.POSITION.BOTTOM_RIGHT,
                    } as ToastOptions);
                  }
                  fetchData();
                } catch (error: any) {
                  throw error || "Une erreur est survenue, veuillez réessayer";
                }
              },
              title: "Attention",
              description: "Voulez-vous vraiment confirmer votre action ?",
            }),
          ])
        : null,
  },
];

const deleteAllProductsSelected = async (ids: Product[]) => {
  try {
    const deletePromises = ids.map((row) => deleteProduct(row.id));
    const responses = await Promise.all(deletePromises);
    const allDeleted = responses.every((response) => response.status === 200);
    if (allDeleted) {
      toast.success("Tous les produits sélectionnés ont été supprimés.", {
        autoClose: 2000,
        position: toast.POSITION.BOTTOM_RIGHT,
      } as ToastOptions);
    }
    fetchData();
  } catch (error: any) {
    toast.error("Une erreur est survenue.", {
      autoClose: 2000,
      position: toast.POSITION.BOTTOM_RIGHT,
    } as ToastOptions);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="container">
    <h1>Produits</h1>
    <DataTable
      :columns="columns"
      :data="data"
      :actions="actions"
      :itemsPerPage="itemsPerPage"
      @update:itemsPerPage="changeItemsPerPage"
      @update:currentPage="changeCurrentPage"
      :deleteAll="isAdmin ? deleteAllProductsSelected : undefined"
      :totalCount="totalCount"
      :currentPage="page"
      :totalPages="totalPages"
      :isLoading="loading"
    >
      <template v-slot:header>
        <v-text-field
          prepend-inner-icon="fa-solid fa-magnifying-glass"
          density="compact"
          label="Rechercher un produit"
          variant="solo"
          hide-details
          single-line
          style="max-width: 300px"
          v-model="search"
          @input="debouncedSearch"
        ></v-text-field>
        <ProductModal
          v-if="store?.user?.role === 'ROLE_ADMIN'"
          btnContent="Nouveau produit"
          color="tertiary"
          type="create"
          :callback="() => fetchData()"
        />
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
