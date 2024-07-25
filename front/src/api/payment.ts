import { HOST } from "@/constants";
import { getApi } from ".";

export const getPaymentLink = async () => {
  const token = localStorage.getItem("token");

  const url = `${HOST}/paylink`;
  const response = await getApi<any>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};
