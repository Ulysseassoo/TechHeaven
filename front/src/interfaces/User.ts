export interface User {
    firstname: string | null;
    lastname: string | null;
    email: string;
    phone: string | null;
    role: string;
    has_confirmed_account: boolean;
    created_at: Date;
    deleted_at: Date | null;
    last_updated_password: Date | null;
    number_connexion_attempts: number;
    blocked_until: Date | null;
}