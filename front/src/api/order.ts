import type { Order } from "@/interfaces/Order";
import { postApi } from ".";
import { getApi } from ".";
import { HOST } from "@/constants";

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
}

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