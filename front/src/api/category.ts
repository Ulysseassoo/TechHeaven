import {
    deleteApi,
    getApi,
    putApi,
    postApi,
    type ApiSuccess,
    type UpdateProps,
    type CreateProps,
  } from "@/api";
  import { HOST } from "@/constants";
  import type { Category } from "@/interfaces/Category";
  
  interface SearchQueryParams {
    search?: string;
    page?: number;
    limit?: number;
  }
  
  export const getCategories = async ({
    search = "",
    page = 1,
    limit = 10,
  }: SearchQueryParams) => {
    const token = localStorage.getItem("token");
  
    const queryParams = new URLSearchParams({
      search,
      page: page.toString(),
      limit: limit.toString(),
    }).toString();
  
    const url = `${HOST}/categories?${queryParams}`;
    const response = await getApi<Category[]>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response;
  };
  
  export const deleteCategory = async (id: string) => {
    const url = `${HOST}/categories/${id}`;
    const token = localStorage.getItem("token");
    const response = await deleteApi<ApiSuccess>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (response.status !== 200) {
      throw new Error(response.message);
    }
  
    return response;
  };
  
  export const updateCategory = async ({ id, data, config }: UpdateProps<Category>) => {
    const url = `${HOST}/categories/${id}`;
    const token = localStorage.getItem("token");
    const response = await putApi<Category>(url, data, {
      ...config,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response;
  };
  
  export const createCategory = async ({ data, config }: CreateProps<Category>) => {
    const url = `${HOST}/categories`;
    const token = localStorage.getItem("token");
    const response = await postApi<Category>(url, data, {
      ...config,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response;
  };
  