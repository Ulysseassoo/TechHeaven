import { HOST } from "@/constants";
import { postApi, type CreateProps } from ".";

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
