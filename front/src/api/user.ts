import { ApiSuccess, deleteApi, getApi, putApi } from ".";
import { HOST } from "../constants";
import { User } from "../interfaces/User";

interface SearchQueryParams { search?: string; page?: number; limit?: number }

export const getUsers = async ({ search = '', page = 1, limit = 10 }: SearchQueryParams) => {
    const token = localStorage.getItem('token');

    const queryParams = new URLSearchParams({
        search,
        page: page.toString(),
        limit: limit.toString()
    }).toString();

    const url = `${HOST}/users?${queryParams}`;
    const response = await getApi<User[]>(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response;
}

export const deleteUser = async (userId: string) => {
    const url = `${HOST}/users/${userId}`;
    const token = localStorage.getItem('token');
    const response = await deleteApi<ApiSuccess>(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if(response.status !== 200) {
        throw new Error(response.message);
    }

    return response;
}

export const updateUser = async (userId: string, data: Partial<User>) => {
    const url = `${HOST}/users/${userId}`;
    const token = localStorage.getItem('token');
    const response = await putApi<User>(url, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    
    return response;
}