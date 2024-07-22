import {
  deleteApi,
  getApi,
  putApi,
  postApi,
  type ApiSuccess,
  type UpdateProps,
  type CreateProps,
} from "@/api";
import { HOST } from "@/constants";
import type { Product } from "@/interfaces/Product";

interface SearchQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const getProducts = async ({
  search = "",
  page = 1,
  limit = 10,
}: SearchQueryParams) => {
  const token = localStorage.getItem("token");

  const queryParams = new URLSearchParams({
    search,
    page: page.toString(),
    limit: limit.toString(),
  }).toString();

  const url = `${HOST}/products?${queryParams}`;
  const response = await getApi<Product[]>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const deleteProduct = async (id: string) => {
  const url = `${HOST}/products/${id}`;
  const token = localStorage.getItem("token");
  const response = await deleteApi<ApiSuccess>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) {
    throw new Error(response.message);
  }

  return response;
};

export const updateProduct = async ({
  id,
  data,
  config,
}: UpdateProps<Product>) => {
  const url = `${HOST}/products/${id}`;
  const token = localStorage.getItem("token");
  const response = await putApi<Product>(url, data, {
    ...config,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const createProduct = async ({ data, config }: CreateProps<Product>) => {
  const url = `${HOST}/products`;
  const token = localStorage.getItem("token");
  const response = await postApi<Product>(url, data, {
    ...config,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};
