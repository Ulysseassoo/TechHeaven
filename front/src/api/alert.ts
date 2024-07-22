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
import type { Alert } from "@/interfaces/Alert";

interface SearchQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const getAlerts = async ({
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

  const url = `${HOST}/alerts?${queryParams}`;
  const response = await getApi<Alert[]>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const deleteAlert = async (id: string) => {
  const url = `${HOST}/alerts/${id}`;
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

export const updateAlert = async ({ id, data, config }: UpdateProps<Alert>) => {
  const url = `${HOST}/alerts/${id}`;
  const token = localStorage.getItem("token");
  const response = await putApi<Alert>(url, data, {
    ...config,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const createAlert = async ({ data, config }: CreateProps<Alert>) => {
  const url = `${HOST}/alerts`;
  const token = localStorage.getItem("token");
  const response = await postApi<Alert>(url, data, {
    ...config,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};
