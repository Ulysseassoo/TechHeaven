<script setup lang="ts">
import { h, onMounted } from "vue";
import type { TableColumn } from "@/interfaces/Table";
import type { Category } from "@/interfaces/Category";
import { useGetPagination } from "@/hooks/useGetPagination";
import { deleteCategory, getCategories } from "@/api/category";
import { toast, type ToastOptions } from "vue3-toastify";
import DataTable from "@/components/DataTable.vue";
import ModalButton from "@/components/ModalButton.vue";
import CategoryModal from "@/components/Admin/CategoryModal.vue";

const columns: TableColumn<Category>[] = [
  { value: "id", label: "Id" },
  { value: "name", label: "Nom" },
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
} = useGetPagination<Category>({
  getData: getCategories,
});

const actions = [
  {
    label: "Voir",
    id: "view",
    icon: "fa-solid fa-eye",
    renderCell: (row: Category) =>
      h(CategoryModal, {
        category: row,
        type: "detail",
        icon: "fa-solid fa-eye",
        tooltipLabel: "Voir",
      }),
  },
  {
    label: "Modifier",
    id: "edit",
    renderCell: (row: Category) =>
      h(CategoryModal, {
        category: row,
        type: "edit",
        icon: "fa-solid fa-pen",
        tooltipLabel: "Modifier",
        callback: () => fetchData(),
      }),
  },
  {
    label: "Supprimer",
    id: "delete",
    renderCell: (row: Category) =>
      h("div", [
        h(ModalButton, {
          icon: "fa-solid fa-trash",
          tooltipLabel: "Supprimer",
          action: async () => {
            try {
              const response = await deleteCategory(row.id);
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
      ]),
  },
];

const deleteAllProductsSelected = async (ids: Category[]) => {
  try {
    const deletePromises = ids.map((row) => deleteCategory(row.id));
    const responses = await Promise.all(deletePromises);
    const allDeleted = responses.every((response) => response.status === 200);
    if (allDeleted) {
      toast.success("Toutes les catégories sélectionnés ont été supprimés.", {
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
    <h1>Catégories</h1>
    <DataTable
      :columns="columns"
      :data="data"
      :actions="actions"
      :itemsPerPage="itemsPerPage"
      @update:itemsPerPage="changeItemsPerPage"
      @update:currentPage="changeCurrentPage"
      :deleteAll="deleteAllProductsSelected"
      :totalCount="totalCount"
      :currentPage="page"
      :totalPages="totalPages"
      :isLoading="loading"
    >
      <template v-slot:header>
        <v-text-field
          prepend-inner-icon="fa-solid fa-magnifying-glass"
          density="compact"
          label="Rechercher une catégorie"
          variant="solo"
          hide-details
          single-line
          style="max-width: 300px"
          v-model="search"
          @input="debouncedSearch"
        ></v-text-field>
        <CategoryModal
          btnContent="Nouvelle catégorie"
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
