const generateUniqueEmail = () => {
    const randomString = Math.random().toString(36).substring(2, 8);
    const domain = 'anonym.com';
    const email = `user_${randomString}@${domain}`;
    return email;
};

export const anonymizeUserData = () => {
    const user = {
        firstname: "Anonyme",
        lastname: "Anonyme",
        email: generateUniqueEmail(),
        password: "",
        phone: "",
        deleted_at: new Date()
    }

    return user;
};