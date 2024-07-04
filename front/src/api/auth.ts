import { getApi, postApi, type Config, type UserFormProps } from ".";
import { HOST } from "@/constants";
import type { User } from "@/interfaces/User";

interface ChangePasswordProps extends Config {
  data: UserFormProps;
}

interface CheckCodeProps extends Config {
  data: {
    code: string;
  };
}

interface ResetPasswordProps extends Config {
  data: {
    email: string;
  };
}

interface RegisterUserProps extends Config {
  data: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    confirmPassword: string | undefined;
  };
}

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
    console.log(error);
  }
};

export const changeUserPassword = async ({
  data,
  config,
}: ChangePasswordProps) => {
  const token = localStorage.getItem("token");
  const response = await postApi<UserFormProps>(
    HOST + "/change/password",
    data,
    {
      ...config,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response;
};

export const verifyUser = async (token: string) => {
  const response = await postApi<any>(HOST + "/verify", token);

  return response;
};

export const checkCode = async ({ data, config }: CheckCodeProps) => {
  const response = await postApi<any>(HOST + "/verify/code", data, config);

  return response;
};

export const resetPassword = async ({ data, config }: ResetPasswordProps) => {
  const response = await postApi<any>(HOST + "/reset/password", data, config);

  return response;
};

export const registerUser = async ({ data, config }: RegisterUserProps) => {
  const response = await postApi<any>(HOST + "/users", data, config);

  return response;
};

export const loginUser = async ({ data, config }: ChangePasswordProps) => {
  const response = await postApi<any>(HOST + "/auth", data, config);

  return response;
};
