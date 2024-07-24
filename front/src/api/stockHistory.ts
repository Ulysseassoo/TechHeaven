import { type Stats } from "@/interfaces/StockHistory";
import { getApi } from "@/api";
import { HOST } from "@/constants";

export const getStockHistoryStats = async () => {
  const token = localStorage.getItem("token");

  const url = `${HOST}/stock-history/stats`;
  const response = await getApi<Stats>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};
