import { HOST } from "@/constants";
import { deleteApi, getApi, putApi } from ".";
import type { Basket } from "@/interfaces/Basket";

export const getBasket = async () => {
  const token = localStorage.getItem("token");

  const url = `${HOST}/basket`;
  const response = await getApi<Basket>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const getBasketProducts = async (basketId: string | null) => {
  const token = localStorage.getItem("token");

  const url = `${HOST}/basket/${basketId}/products`;
  const response = await getApi<Basket>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const updateProductInBasket = async (
  productId: string,
  action: "remove" | "add" | "delete"
) => {
  const token = localStorage.getItem("token");

  const url = `${HOST}/basket`;
  const response = await putApi<Basket>(
    url,
    { product_id: productId, action },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export const emptyBasket = async () => {
  const token = localStorage.getItem("token");

  const url = `${HOST}/basket`;
  const response = await deleteApi<Basket>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};
