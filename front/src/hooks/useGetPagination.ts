import { ref } from "vue";
import { useDebounce } from "./useDebounce";

interface Props {
  getData: ({
    limit,
    page,
    search,
  }: {
    limit: number;
    page: number;
    search?: string;
  }) => Promise<any>;
}

export const useGetPagination = <T>({ getData }: Props) => {
  const loading = ref<boolean>(true);
  const search = ref<string>("");
  const itemsPerPage = ref<number>(10);
  const totalCount = ref<number>(0);
  const totalPages = ref<number>(0);
  const data = ref<T[]>([]);
  const page = ref<number>(1);

  async function fetchData() {
    loading.value = true;
    try {
      const response = await getData({
        limit: itemsPerPage.value,
        page: page.value,
        search: search.value !== "" ? search.value : undefined,
      });
      if (
        response.totalCount !== undefined &&
        response.totalPages !== undefined
      ) {
        totalCount.value = response.totalCount;
        totalPages.value = response.totalPages;
      }
      loading.value = false;
      data.value = response.data;
    } catch (error) {
      loading.value = false;
    }
  }

  const changeItemsPerPage = (value: number) => {
    itemsPerPage.value = value;
    page.value = 1;
    fetchData();
  };

  const changeCurrentPage = (value: number) => {
    page.value = value;
    fetchData();
  };

  const debouncedSearch = useDebounce(fetchData, 500);

  return {
    loading,
    search,
    itemsPerPage,
    totalCount,
    totalPages,
    page,
    data,
    debouncedSearch,
    fetchData,
    changeCurrentPage,
    changeItemsPerPage,
  };
};
