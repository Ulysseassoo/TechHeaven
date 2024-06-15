import { getApi } from ".";
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