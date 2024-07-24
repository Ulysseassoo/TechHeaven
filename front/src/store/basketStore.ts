import { ref, computed, watch } from "vue";

import { defineStore } from "pinia";

import type { Basket } from "@/interfaces/Basket";
import type { Product } from "@/interfaces/Product";
import {
  getBasket,
  getBasketProducts,
  updateProductInBasket,
} from "@/api/basket";

export const useBasketStore = defineStore("basket", () => {
  const basket = ref<Basket>([]);

  const basketId = ref(null);

  const fetchBasket = async () => {
    try {
      const res = await getBasket();
      basketId.value = res.data.id;
    } catch (err) {
      console.log(err, "Error occured in basket store: fetch basket");
    }
  };

  const fetchBasketProducts = async () => {
    try {
      const res = await getBasketProducts(basketId.value);
      basket.value = res.data.map((product) => {
        return {
          product: product.product,
          orderQuantity: product.quantity,
        };
      });
    } catch (err) {
      console.log(err, "Error occured in basket store: fetch basket products");
    }
  };

  const findItemIndexInBasket = (product: Product) => {
    const productKey = basket.value.findIndex(
      (item) => item.product.id === product.id,
    );

    return productKey;
  };

  const addItemToBasket = async (product: Product) => {
    const productKey = findItemIndexInBasket(product);

    try {
      const res = await updateProductInBasket(product.id, "add");
      if (res.status === 200) {
        if (productKey !== -1) {
          basket.value[productKey].orderQuantity += 1;
        } else {
          basket.value.push({ product, orderQuantity: 1 });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const decrementItemFromBasket = async (product: Product) => {
    const productKey = findItemIndexInBasket(product);

    try {
      const res = await updateProductInBasket(product.id, "remove");
      if (res.status === 200) {
        if (productKey !== -1) {
          if (basket.value[productKey].orderQuantity > 1) {
            basket.value[productKey].orderQuantity -= 1;
          } else {
            basket.value.splice(productKey, 1);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeItemFromBasket = async (product: Product) => {
    const productKey = findItemIndexInBasket(product);

    try {
      const res = await updateProductInBasket(product.id, "delete");
      if (res.status) {
        if (productKey !== -1) {
          basket.value.splice(productKey, 1);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getTotalItems = (): number => {
    return basket.value.reduce((total, item) => total + item.orderQuantity, 0);
  };

  const getTotalPrice = (): number => {
    return basket.value.reduce(
      (total, item) => total + item.product.price * item.orderQuantity,
      0,
    );
  };

  const emptyBasket = () => {
    basket.value = [];
  };

  const getTotalPriceOfOneProduct = (product: Product) => {
    const productKey = findItemIndexInBasket(product);
    if (productKey !== -1) {
      return (
        basket.value[productKey].orderQuantity *
        basket.value[productKey].product.price
      );
    }
  };

  const basketProductCount = computed(() =>
    basket.value.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.orderQuantity;
    }, 0),
  );

  return {
    fetchBasket,
    fetchBasketProducts,
    basket,
    basketId,
    addItemToBasket,
    decrementItemFromBasket,
    emptyBasket,
    removeItemFromBasket,
    getTotalItems,
    getTotalPrice,
    basketProductCount,
    getTotalPriceOfOneProduct,
  };
});
