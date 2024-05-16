import axios from "axios";

interface ApiProps<T> {
    data?: T;
    status: number;
    message?: string;
}