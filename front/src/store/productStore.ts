import { ref } from "vue";
import { defineStore } from "pinia";
import { getProducts } from "@/api/product";
import { type Product } from "@/interfaces/Product";

export const useProductStore = defineStore("products", () => {
  const products = ref<Product[]>([]);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const fetchProducts = async () => {
    isLoading.value = true;

    try {
      const res = await getProducts({
        search: "",
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

  return { fetchProducts, products, isLoading, error };
});
