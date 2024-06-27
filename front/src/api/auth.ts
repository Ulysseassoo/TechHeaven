import { getApi } from ".";
import { HOST } from "@/constants";
import type { User } from "@/interfaces/User";

export const getUserInformation = async () => {
  const token = localStorage.getItem("token");
  const response = await getApi<User>(HOST + "/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const logoutUser = async () => {
  try {
    localStorage.removeItem("token");
  } catch (error: any) {
    console.log(error)
  }
}
