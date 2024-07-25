import type { Order } from "@/interfaces/Order";
import {
  postApi,
  putApi,
  type UpdateProps,
} from ".";
import { getApi } from ".";
import { HOST } from "@/constants";

interface SearchQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const getUserOrders = async ({
  search = "",
  userId,
}: {
  search?: string;
  userId?: string;
}) => {
  const queryParams = new URLSearchParams({
    search,
  }).toString();

  const url = `${HOST}/users/${userId}/orders?${queryParams}`;
  const token = localStorage.getItem("token");
  const response = await getApi<Order[]>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const getOrders = async ({
  search = "",
  page = 1,
  limit = 10,
}: SearchQueryParams) => {
  const queryParams = new URLSearchParams({
    search,
    page: page.toString(),
    limit: limit.toString(),
  }).toString();

  const url = `${HOST}/orders?${queryParams}`;
  const token = localStorage.getItem("token");
  const response = await getApi<Order[]>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const createOrder = async () => {
  const url = `${HOST}/orders`;
  const token = localStorage.getItem("token");
  const response = await postApi<any>(
    url,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response;
};

export const updateOrder = async ({ id, data, config }: UpdateProps<Order>) => {
  const url = `${HOST}/orders/${id}`;
  const token = localStorage.getItem("token");
  const response = await putApi<Order>(url, data, {
    ...config,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};
