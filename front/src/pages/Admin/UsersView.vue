<script setup lang="ts">
import { h, onMounted, ref } from "vue";
import DataTable from "@/components/DataTable.vue";
import { deleteUser, getUsers } from "@/api/user";
import type { User } from "@/interfaces/User";
import type { TableColumn } from "@/interfaces/Table";
import { toast, type ToastOptions } from "vue3-toastify";
import { useDebounce } from "@/hooks/useDebounce";
import ModalButton from "@/components/ModalButton.vue";
import UserModal from "@/components/Admin/UserModal.vue";

const columns: TableColumn<User>[] = [
  { value: "firstname", label: "Prénom" },
  { value: "lastname", label: "Nom" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Téléphone" },
  { value: "role", label: "Rôle" },
  { value: "has_confirmed_account", label: "Compte confirmé" },
  {
    value: "addresses",
    label: "Addresse principale",
    renderCell: (row) => row.addresses.find((a) => a.is_selected)?.address,
  },
  { value: "created_at", label: "Crée le" },
  { value: "updated_at", label: "Dernière mise à jour" },
  { value: "password_updated_at", label: "Mot de passe mis à jour le" },
];

const users = ref<User[]>([]);
const itemsPerPage = ref<number>(10);
const totalCount = ref<number>(0);
const totalPages = ref<number>(0);
const page = ref<number>(1);
const loading = ref<boolean>(true);
const search = ref<string>("");
const actions = [
  {
    label: "Voir",
    id: "view",
    icon: "fa-solid fa-eye",
    renderCell: (row: User) =>
      h(UserModal, {
        user: row,
        icon: "fa-solid fa-eye",
        tooltipLabel: "Voir",
      }),
  },
  {
    label: "Modifier",
    id: "edit",
    renderCell: (row: User) =>
      h(UserModal, {
        user: row,
        canEdit: true,
        icon: "fa-solid fa-pen",
        tooltipLabel: "Modifier",
        callback: () => fetchUsers(),
      }),
  },
  {
    label: "Supprimer",
    id: "delete",
    renderCell: (row: User) =>
      h("div", [
        !row.deleted_at
          ? h(ModalButton, {
              icon: "fa-solid fa-trash",
              tooltipLabel: "Supprimer",
              action: async () => {
                try {
                  const response = await deleteUser(row.id);
                  if (response.message !== undefined) {
                    toast.success(response.message, {
                      autoClose: 2000,
                      position: toast.POSITION.BOTTOM_RIGHT,
                    } as ToastOptions);
                  }
                  fetchUsers();
                } catch (error: any) {
                  throw error || "Une erreur est survenue, veuillez réessayer";
                }
              },
              title: "Attention",
              description: "Voulez-vous vraiment confirmer votre action ?",
            })
          : null,
      ]),
  },
];

async function fetchUsers() {
  loading.value = true;
  try {
    const response = await getUsers({
      limit: itemsPerPage.value,
      page: page.value,
      search: search.value !== "" ? search.value : undefined,
    });
    users.value = response.data;
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

const changeItemsPerPage = (value: number) => {
  itemsPerPage.value = value;
  page.value = 1;
  fetchUsers();
};

const changeCurrentPage = (value: number) => {
  page.value = value;
  fetchUsers();
};

onMounted(() => {
  fetchUsers();
});

const debouncedSearchUsers = useDebounce(fetchUsers, 500);
const deleteAllUsersSelected = async (ids: string[]) => {
  try {
    const deletePromises = ids.map((userId) => deleteUser(userId));
    const responses = await Promise.all(deletePromises);
    const allDeleted = responses.every((response) => response.status === 200);
    if (allDeleted) {
      toast.success("Tous les utilisateurs sélectionnés ont été supprimés.", {
        autoClose: 2000,
        position: toast.POSITION.BOTTOM_RIGHT,
      } as ToastOptions);
    }
    fetchUsers();
  } catch (error) {
    toast.error("Une erreur est survenue.", {
      autoClose: 2000,
      position: toast.POSITION.BOTTOM_RIGHT,
    } as ToastOptions);
  }
};
</script>

<template>
  <div class="container">
    <h1>Utilisateurs</h1>
    <DataTable
      :columns="columns"
      :data="users"
      :actions="actions"
      :itemsPerPage="itemsPerPage"
      @update:itemsPerPage="changeItemsPerPage"
      @update:currentPage="changeCurrentPage"
      :deleteAll="deleteAllUsersSelected"
      :totalCount="totalCount"
      :currentPage="page"
      :totalPages="totalPages"
      :isLoading="loading"
    >
      <template v-slot:header>
        <v-text-field
          prepend-inner-icon="fa-solid fa-magnifying-glass"
          density="compact"
          label="Rechercher un utilisateur"
          variant="solo"
          hide-details
          single-line
          style="max-width: 300px"
          v-model="search"
          @input="debouncedSearchUsers"
        ></v-text-field>
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
