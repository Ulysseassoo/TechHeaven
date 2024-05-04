export const anonymizeUserData = () => {
    const user = {
        firstname: "Anonyme",
        lastname: "Anonyme",
        email: "anonym@anonym.com",
        password: "",
        phone: "",
        deleted_at: new Date()
    }

    return user;
};