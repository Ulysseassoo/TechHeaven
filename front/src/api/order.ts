import type { Order } from "@/interfaces/Order";
import { getApi } from ".";
import { HOST } from "@/constants";

export const getUserOrders = async ({
    search = "",
    userId,
  }: { search?: string, userId?: string }) => {

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