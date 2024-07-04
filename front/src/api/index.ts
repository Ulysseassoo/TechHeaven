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

export interface UpdateProps<T> {
  id: string;
  data: Partial<T>;
  config: AxiosRequestConfig;
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
    return error.response.data;
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
    return error.response.data;
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
    return error.response.data;
  }
};
