import type { Order } from "@/interfaces/Order";
import { getApi } from ".";
import { HOST } from "@/constants";

export const getUserOrders = async ({
    userId,
  }: { userId?: string }) => {
    const url = `${HOST}/users/${userId}/orders`;
    const token = localStorage.getItem("token");
    const response = await getApi<Order[]>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response;
};