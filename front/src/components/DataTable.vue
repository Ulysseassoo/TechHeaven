<script setup lang="ts">
import moment from "moment";
import { computed, ref, watch } from "vue";
import type { RendererElement, RendererNode, VNode } from "vue";
import type { TableColumn } from "../interfaces/Table";

interface Action {
  label: string;
  id: string;
  renderCell: (
    item: any
  ) => VNode<
    RendererNode,
    RendererElement,
    {
      [key: string]: any;
    }
  >;
}

interface DataTableProps {
  data: any[];
  columns: TableColumn<any>[];
  actions: Action[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalCount: number;
  isLoading: boolean;
  deleteAll?: (ids: string[]) => Promise<void>;
}

const props = defineProps<DataTableProps>();
const emit = defineEmits(["update:itemsPerPage", "update:currentPage"]);
const sortBy = ref("");
const sortOrder = ref<"asc" | "desc">("asc");
const selectedItems = ref<string[]>([]);
const localItemsPerPage = ref(props.itemsPerPage);
const currentPage = ref(props.currentPage);
const selectAll = ref(false);
const loadingDelete = ref<boolean>(false);
const tableContainerRef = ref<HTMLDivElement | null>(null);
const data = ref(props.data);

watch(
  () => props.itemsPerPage,
  (newItemsPerPage) => {
    localItemsPerPage.value = newItemsPerPage;
  }
);

watch(
  () => props.currentPage,
  (newPage) => {
    currentPage.value = newPage;
  }
);

watch(
  () => props.data,
  (newData) => {
    data.value = newData;
  }
);

const emitItemsPerPage = () => {
  emit("update:itemsPerPage", localItemsPerPage.value);
};

const emitCurrentPage = (page: number) => {
  emit("update:currentPage", page);
};

const sortedData = computed(() => {
  let sorted = data.value;
  if (sortBy.value) {
    sorted.sort((a, b) => {
      const aValue = a[sortBy.value];
      const bValue = b[sortBy.value];
      if (aValue < bValue) return sortOrder.value === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder.value === "asc" ? 1 : -1;
      return 0;
    });
  }
  return sorted;
});

const allSelected = computed(
  () =>
    sortedData.value.length > 0 && selectedItems.value.length === sortedData.value.length
);

const startItem = computed(() => (currentPage.value - 1) * localItemsPerPage.value + 1);

const endItem = computed(() =>
  Math.min(currentPage.value * localItemsPerPage.value, props.totalCount)
);

const handleSort = (column: string) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = column;
    sortOrder.value = "asc";
  }
};

const toggleSelectAll = () => {
  if (!selectAll.value) {
    selectAll.value = true;
    sortedData.value.forEach((row) => {
      selectedItems.value.push(row.id);
    });
  } else {
    selectAll.value = false;
    selectedItems.value = [];
  }
};

const handleDeleteAll = async () => {
  loadingDelete.value = true;
  try {
    if (props.deleteAll !== undefined) {
      await props.deleteAll(selectedItems.value);
      loadingDelete.value = false;
      selectedItems.value = [];
    }
  } catch (error: any) {
    console.log(error);
    loadingDelete.value = false;
  }
};
</script>

<template>
  <div class="table-container">
    <div class="search-container">
      <div class="header">
        <slot name="header"> </slot>
      </div>
      <v-btn
        color="danger"
        v-if="deleteAll"
        @click="handleDeleteAll"
        :disabled="selectedItems.length <= 0"
        :loading="loadingDelete"
        >Delete</v-btn
      >
    </div>
    <v-table class="table" fixedHeader ref="tableContainerRef">
      <thead>
        <div v-if="props.isLoading" class="loading-container">
          <v-progress-linear color="primary" indeterminate></v-progress-linear>
        </div>
        <tr>
          <th>
            <v-container fluid class="checkbox_container">
              <v-checkbox v-model="allSelected" @change="toggleSelectAll"></v-checkbox>
            </v-container>
          </th>
          <th
            v-for="column in columns"
            :key="column.label"
            @click="handleSort(column.value)"
          >
            {{ column.label }}
            <v-icon v-if="sortBy === column.value">{{
              sortOrder === "asc" ? "fa-solid fa-sort-up" : "fa-solid fa-sort-down"
            }}</v-icon>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in sortedData" :key="row.id">
          <td>
            <v-container fluid class="checkbox_container">
              <v-checkbox v-model="selectedItems" :value="row.id"></v-checkbox>
            </v-container>
          </td>
          <td v-for="column in columns" :key="column.label">
            <div v-if="column.value === 'created_at'">
              {{ moment(row[column.value]).format("LLL") }}
            </div>
            <div
              v-else-if="row[column.value] === undefined || row[column.value] === null"
            >
              -
            </div>
            <div v-else-if="typeof row[column.value] === 'boolean'">
              {{ row[column.value] ? "Yes" : "No" }}
            </div>
            <div v-else>
              {{ row[column.value] }}
            </div>
          </td>
          <td>
            <v-container fluid class="actions-container">
              <div v-for="action in actions" :key="action.label">
                <component :is="action.renderCell(row)"></component>
              </div>
            </v-container>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-container fluid class="pagination-container">
      <div class="arrows-container">
        <v-icon
          :class="{ 'is-disabled': currentPage <= 1 }"
          @click="emitCurrentPage(currentPage - 1)"
          >fa-solid fa-angle-left</v-icon
        >
        <v-icon
          :class="{ 'is-disabled': currentPage >= props.totalPages }"
          @click="emitCurrentPage(currentPage + 1)"
          >fa-solid fa-angle-right</v-icon
        >
      </div>
      <div>
        <p>{{ startItem }}-{{ endItem }} of {{ props.totalCount }}</p>
      </div>
      <div class="items-per-page">
        <p>Items per page:</p>
        <v-select
          variant="plain"
          v-model="localItemsPerPage"
          @update:modelValue="emitItemsPerPage"
          :items="[10, 25, 50, 100]"
        ></v-select>
      </div>
    </v-container>
  </div>
</template>

<style scoped lang="css">
.checkbox_container {
  width: 50px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  & > div {
    display: flex;
  }
}
.table {
  flex: 1;
  border-radius: 0px;
  font-size: 14px;
  font-weight: normal;
  border: none;
  border-collapse: collapse;
  width: 100%;
  max-width: 100%;
  white-space: nowrap;
  background-color: white;
  overflow: scroll;
  position: relative;
  & td,
  th {
    text-align: center;
    padding: 8px;
  }

  & td {
    border-right: 1px solid #f8f8f8;
    font-size: 12px;
  }

  & thead th {
    color: #ffffff;
    background: #181c1f !important;
  }
}
.pagination-container {
  height: 65px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  gap: 1.5rem;
}
.items-per-page {
  display: flex;
  gap: 10px;
  align-items: center;
}
.arrows-container {
  display: flex;
  gap: 10px;
  align-items: center;
  & i {
    cursor: pointer;
  }
}

.is-disabled {
  pointer-events: none;
  color: grey;
}

.loading-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
}

.actions-container {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  justify-content: flex-end;
}

.table-container {
  border: 1px solid #efefef;
  height: 80vh;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
}
.search-container {
  padding: 1.5rem;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  & div.v-field__prepend-inner i {
    font-size: 1rem !important;
  }
  gap: 1rem;
}

.header {
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;
}
div.v-field__prepend-inner i {
  font-size: 1rem !important;
}
</style>
