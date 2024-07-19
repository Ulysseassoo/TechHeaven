<script setup lang="ts">
import { h, onMounted, ref } from "vue";
import type { TableColumn } from "@/interfaces/Table";
import type { Alert } from "@/interfaces/Alert";
import { toast, type ToastOptions } from "vue3-toastify";
import { useDebounce } from "@/hooks/useDebounce";
import { deleteAlert, getAlerts } from "@/api/alert";
import DataTable from "@/components/DataTable.vue";
import ModalButton from "@/components/ModalButton.vue";
import AlertModal from "@/components/Admin/AlertModal.vue";

const columns: TableColumn<Alert>[] = [
  { value: "name", label: "Nom" },
  { value: "type", label: "Type" },
  { value: "param", label: "Paramètre" },
];

const loading = ref<boolean>(true);
const search = ref<string>("");
const alerts = ref<Alert[]>([]);
const itemsPerPage = ref<number>(10);
const totalCount = ref<number>(0);
const totalPages = ref<number>(0);
const page = ref<number>(1);
const actions = [
  {
    label: "Voir",
    id: "view",
    icon: "fa-solid fa-eye",
    renderCell: (row: Alert) =>
      h(AlertModal, {
        alert: row,
        icon: "fa-solid fa-eye",
        tooltipLabel: "Voir",
      }),
  },
  {
    label: "Modifier",
    id: "edit",
    renderCell: (row: Alert) =>
      h(AlertModal, {
        alert: row,
        canEdit: true,
        icon: "fa-solid fa-pen",
        tooltipLabel: "Modifier",
        callback: () => fetchAlerts(),
      }),
  },
  {
    label: "Supprimer",
    id: "delete",
    renderCell: (row: Alert) =>
      h("div", [
        h(ModalButton, {
          icon: "fa-solid fa-trash",
          tooltipLabel: "Supprimer",
          action: async () => {
            try {
              const response = await deleteAlert(row.id);
              if (response.message !== undefined) {
                toast.success(response.message, {
                  autoClose: 2000,
                  position: toast.POSITION.BOTTOM_RIGHT,
                } as ToastOptions);
              }
              fetchAlerts();
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

async function fetchAlerts() {
  loading.value = true;
  try {
    const response = await getAlerts({
      limit: itemsPerPage.value,
      page: page.value,
      search: search.value !== "" ? search.value : undefined,
    });
    alerts.value = response.data;
    if (
      response.totalCount !== undefined &&
      response.totalPages !== undefined
    ) {
      totalCount.value = response.totalCount;
      totalPages.value = response.totalPages;
    }
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
}

const debouncedSearchedAlerts = useDebounce(fetchAlerts, 500);
const deleteAllAlertsSelected = async (ids: string[]) => {
  try {
    const deletePromises = ids.map((id) => deleteAlert(id));
    const responses = await Promise.all(deletePromises);
    const allDeleted = responses.every((response) => response.status === 200);
    if (allDeleted) {
      toast.success("Toutes les alertes sélectionnés ont été supprimés.", {
        autoClose: 2000,
        position: toast.POSITION.BOTTOM_RIGHT,
      } as ToastOptions);
    }
    fetchAlerts();
  } catch (error) {
    toast.error("Une erreur est survenue.", {
      autoClose: 2000,
      position: toast.POSITION.BOTTOM_RIGHT,
    } as ToastOptions);
  }
};

const changeItemsPerPage = (value: number) => {
  itemsPerPage.value = value;
  page.value = 1;
  fetchAlerts();
};

const changeCurrentPage = (value: number) => {
  page.value = value;
  fetchAlerts();
};

onMounted(() => {
  fetchAlerts();
});
</script>

<template>
  <div class="container">
    <h1>Alertes</h1>
    <DataTable
      :columns="columns"
      :data="alerts"
      :actions="actions"
      :itemsPerPage="itemsPerPage"
      @update:itemsPerPage="changeItemsPerPage"
      @update:currentPage="changeCurrentPage"
      :deleteAll="deleteAllAlertsSelected"
      :totalCount="totalCount"
      :currentPage="page"
      :totalPages="totalPages"
      :isLoading="loading"
    >
      <template v-slot:header>
        <v-text-field
          prepend-inner-icon="fa-solid fa-magnifying-glass"
          density="compact"
          label="Rechercher une alerte"
          variant="solo"
          hide-details
          single-line
          style="max-width: 300px"
          v-model="search"
          @input="debouncedSearchedAlerts"
        ></v-text-field>
        <v-btn color="tertiary">Nouvelle Alerte</v-btn>
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
