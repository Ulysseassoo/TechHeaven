import axios, { AxiosRequestConfig } from "axios";

interface ApiProps<T> {
    data: T;
    status: number;
    message?: string;
}

export const getApi = async <T>(url: string, config?: AxiosRequestConfig<any> | undefined): Promise<ApiProps<T>> => {
    try {
        const response = await axios.get<T>(url, config);
        return response.data as ApiProps<T>;;
    } catch (error: any) {
        return error.response.data;
    }
}