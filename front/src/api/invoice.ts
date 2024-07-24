import { HOST } from "@/constants";
import { postApi, type CreateProps } from ".";

export const createInvoice = async (orderId: string) => {
  const url = `${HOST}/invoices/${orderId}`;
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
