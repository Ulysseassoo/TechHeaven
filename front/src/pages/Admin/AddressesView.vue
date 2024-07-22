<script setup lang="ts">
import { deleteAddress, getAddresses } from "@/api/address";
import DataTable from "@/components/DataTable.vue";
import { useDebounce } from "@/hooks/useDebounce";
import type { Address } from "@/interfaces/Address";
import type { TableColumn } from "@/interfaces/Table";
import { h, onMounted, ref } from "vue";
import ModalButton from "@/components/ModalButton.vue";
import { toast, type ToastOptions } from "vue3-toastify";
import AddressModal from "@/components/Admin/AddressModal.vue";

const columns: TableColumn<Address>[] = [
  { value: "city", label: "Ville" },
  { value: "country", label: "Pays" },
  { value: "postal_code", label: "Code Postal" },
  { value: "address", label: "Addresse complète" },
  { value: "other", label: "Autre" },
  { value: "is_selected", label: "Addresse principal" },
];

const loading = ref<boolean>(true);
const search = ref<string>("");
const addresses = ref<Address[]>([]);
const itemsPerPage = ref<number>(10);
const totalCount = ref<number>(0);
const totalPages = ref<number>(0);
const page = ref<number>(1);
const actions = [
  {
    label: "Voir",
    id: "view",
    icon: "fa-solid fa-eye",
    renderCell: (row: Address) =>
      h(AddressModal, {
        address: row,
        icon: "fa-solid fa-eye",
        tooltipLabel: "Voir",
      }),
  },
  {
    label: "Modifier",
    id: "edit",
    renderCell: (row: Address) =>
      h(AddressModal, {
        address: row,
        canEdit: true,
        icon: "fa-solid fa-pen",
        tooltipLabel: "Modifier",
        callback: () => fetchAddresses(),
      }),
  },
  {
    label: "Supprimer",
    id: "delete",
    renderCell: (row: Address) =>
      h("div", [
        h(ModalButton, {
          icon: "fa-solid fa-trash",
          tooltipLabel: "Supprimer",
          action: async () => {
            try {
              const response = await deleteAddress(row.id);
              if (response.message !== undefined) {
                toast.success(response.message, {
                  autoClose: 2000,
                  position: toast.POSITION.BOTTOM_RIGHT,
                } as ToastOptions);
              }
              fetchAddresses();
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

async function fetchAddresses() {
  loading.value = true;
  try {
    const response = await getAddresses({
      limit: itemsPerPage.value,
      page: page.value,
      search: search.value !== "" ? search.value : undefined,
    });
    addresses.value = response.data;
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

const debouncedSearchedAddresses = useDebounce(fetchAddresses, 500);
const deleteAllAddressesSelected = async (ids: Address[]) => {
  try {
    const deletePromises = ids.map((row) => deleteAddress(row.id));
    const responses = await Promise.all(deletePromises);
    const allDeleted = responses.every((response) => response.status === 200);
    if (allDeleted) {
      toast.success("Toutes les adresses sélectionnés ont été supprimés.", {
        autoClose: 2000,
        position: toast.POSITION.BOTTOM_RIGHT,
      } as ToastOptions);
    }
    fetchAddresses();
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
  fetchAddresses();
};

const changeCurrentPage = (value: number) => {
  page.value = value;
  fetchAddresses();
};

onMounted(() => {
  fetchAddresses();
});
</script>

<template>
  <div class="container">
    <h1>Adresses</h1>
    <DataTable
      :columns="columns"
      :data="addresses"
      :actions="actions"
      :itemsPerPage="itemsPerPage"
      @update:itemsPerPage="changeItemsPerPage"
      @update:currentPage="changeCurrentPage"
      :deleteAll="deleteAllAddressesSelected"
      :totalCount="totalCount"
      :currentPage="page"
      :totalPages="totalPages"
      :isLoading="loading"
    >
      <template v-slot:header>
        <v-text-field
          prepend-inner-icon="fa-solid fa-magnifying-glass"
          density="compact"
          label="Rechercher une addresse"
          variant="solo"
          hide-details
          single-line
          style="max-width: 300px"
          v-model="search"
          @input="debouncedSearchedAddresses"
        ></v-text-field>
        <v-btn color="tertiary">Nouvelle Adresse</v-btn>
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
import { toast, type ToastOptions } from "vue3-toastify";
