import axios from "axios";
import type { AxiosRequestConfig } from "axios";

export interface ApiProps<T> {
  data: T;
  status: number;
  message?: string;
  totalPages?: number;
  currentPage?: number;
  totalCount?: number;
}

export interface Config {
  config: AxiosRequestConfig;
}

export interface UserFormProps {
  email: string;
  password: string;
}

export interface ChangeOldPasswordProps extends UserFormProps {
  oldPassword?: string;
  confirmPassword?: string;
}

export interface UpdateProps<T> {
  id: string;
  data: Partial<T>;
  config: AxiosRequestConfig;
}

export interface CreateProps<T>{
  data: T;
  config: AxiosRequestConfig;
}

export interface UpdatePreference {
  userId: string;
  preferenceId: string;
  alertId: string;
}

export interface ApiSuccess {
  status: number;
  message: string;
}

export const getApi = async <T>(
  url: string,
  config?: AxiosRequestConfig<any> | undefined,
): Promise<ApiProps<T>> => {
  try {
    const response = await axios.get<T>(url, config);
    return response.data as ApiProps<T>;
  } catch (error: any) {
    throw error;
  }
};

export const putApi = async <T>(
  url: string,
  data: Partial<T>,
  config?: AxiosRequestConfig<any> | undefined,
): Promise<ApiProps<T>> => {
  try {
    const response = await axios.put<T>(url, data, config);
    return response.data as ApiProps<T>;
  } catch (error: any) {
    throw error;
  }
};

export const deleteApi = async <T>(
  url: string,
  config?: AxiosRequestConfig<any> | undefined,
): Promise<ApiProps<T>> => {
  try {
    const response = await axios.delete<T>(url, config);
    return response.data as ApiProps<T>;
  } catch (error: any) {
    throw error;
  }
};

export const postApi = async <T>(
  url: string,
  data: T,
  config?: AxiosRequestConfig<any> | undefined,
): Promise<ApiProps<T>> => {
  try {
    const response = await axios.post<T>(url, data, config);
    return response.data as ApiProps<T>;
  } catch (error: any) {
    throw error;
  }
};
