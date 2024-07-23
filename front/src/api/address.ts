import {
  deleteApi,
  getApi,
  postApi,
  putApi,
  type ApiSuccess,
  type CreateProps,
  type UpdateProps,
} from "@/api";
import { HOST } from "@/constants";
import type { Address } from "@/interfaces/Address";

interface SearchQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const getAddresses = async ({
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

  const url = `${HOST}/addresses?${queryParams}`;
  const response = await getApi<Address[]>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const deleteAddress = async (addressId: string) => {
  const url = `${HOST}/addresses/${addressId}`;
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

export const updateAddress = async ({
  id,
  data,
  config,
}: UpdateProps<Address>) => {
  const url = `${HOST}/addresses/${id}`;
  const token = localStorage.getItem("token");
  const response = await putApi<Address>(url, data, {
    ...config,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const createAddress = async ({ data, config, userId }: CreateProps<Partial<Address>> & { userId?: string}) => {
  const url = `${HOST}/users/${userId}/addresses`;
  const token = localStorage.getItem("token");
  const response = await postApi<Partial<Address>>(url, data, {
    ...config,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};
