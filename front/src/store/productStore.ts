import { defineStore } from "pinia";
import { ref } from "vue";
import { getProducts } from "@/api/product";
import { type Product } from "@/interfaces/Product";

export const useProductStore = defineStore("products", () => {
  const products = ref<Product[]>([]);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  const productDetailSelected = ref<Product | null>(null);
  const productSearch = ref("");

  const fetchProducts = async (params?: string) => {
    isLoading.value = true;

    try {
      const res = await getProducts({
        params,
        page: 1,
        limit: 40,
      });
      products.value = res.data;
    } catch (err) {
      console.log(err, "Error occured in product store");
    } finally {
      isLoading.value = false;
    }
  };

  const setSelectedProduct = (product: Product) => {
    productDetailSelected.value = product;
  };

  return {
    fetchProducts,
    products,
    isLoading,
    error,
    setSelectedProduct,
    productDetailSelected,
    productSearch,
  };
});
