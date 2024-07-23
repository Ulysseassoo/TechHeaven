import { ref, computed } from "vue";

import { defineStore } from "pinia";

import type { Basket } from "@/interfaces/Basket";
import type { Product } from "@/interfaces/Product";

export const useBasketStore = defineStore("basket", () => {
  const basket = ref<Basket>([]);

  const findItemIndexInBasket = (product: Product) => {
    const productKey = basket.value.findIndex(
      (item) => item.product.id === product.id
    );

    return productKey;
  };

  const addItemToBasket = (product: Product) => {
    const productKey = findItemIndexInBasket(product);

    if (productKey !== -1) {
      basket.value[productKey].orderQuantity += 1;
    } else {
      basket.value.push({ product, orderQuantity: 1 });
    }
  };

  const decrementItemFromBasket = (product: Product) => {
    const productKey = findItemIndexInBasket(product);

    if (productKey !== -1) {
      if (basket.value[productKey].orderQuantity > 1) {
        basket.value[productKey].orderQuantity -= 1;
      } else {
        basket.value.splice(productKey, 1);
      }
    }
  };

  const removeItemFromBasket = (product: Product) => {
    const productKey = findItemIndexInBasket(product);
    if (productKey !== -1) {
      basket.value.splice(productKey, 1);
    }
  };

  const getTotalItems = (): number => {
    return basket.value.reduce((total, item) => total + item.orderQuantity, 0);
  };

  const getTotalPrice = (): number => {
    return basket.value.reduce(
      (total, item) => total + item.product.price * item.orderQuantity,
      0
    );
  };

  const validateBasket = () => {
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
    }, 0)
  );

  return {
    basket,
    addItemToBasket,
    decrementItemFromBasket,
    validateBasket,
    removeItemFromBasket,
    getTotalItems,
    getTotalPrice,
    basketProductCount,
    getTotalPriceOfOneProduct,
  };
});
