import { deleteApi, getApi, putApi } from "@/api";
import type { ApiSuccess, UpdatePreference, UpdateProps } from "@/api";
import { HOST } from "@/constants";
import type { Preference } from "@/interfaces/Preference";
import type { Stats, User } from "@/interfaces/User";

interface SearchQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const getUsers = async ({
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

  const url = `${HOST}/users?${queryParams}`;
  const response = await getApi<User[]>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const getUsersStats = async () => {
  const token = localStorage.getItem("token");

  const url = `${HOST}/users/stats`;
  const response = await getApi<Stats>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const deleteUser = async (userId: string) => {
  const url = `${HOST}/users/${userId}`;
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

export const updateUser = async ({ id, data, config }: UpdateProps<User>) => {
  const url = `${HOST}/users/${id}`;
  const token = localStorage.getItem("token");
  const response = await putApi<User>(url, data, {
    ...config,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const updateUserPreference = async ({
  userId,
  alertId,
  preferenceId,
}: UpdatePreference) => {
  const url = `${HOST}/users/${userId}/alerts/${alertId}/preferences/${preferenceId}`;
  const token = localStorage.getItem("token");
  const response = await putApi<Preference>(
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
