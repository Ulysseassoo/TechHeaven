import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 1025,
    secure: false,
});

const COMPANY_MAIL = "techheaven@support.com";

export const sendConfirmationEmail = async (userEmail, token) => {
    // TODO Changez le lien avec celui en front
    const mailOptions = {
        from: COMPANY_MAIL,
        to: userEmail,
        subject: 'Confirmation de votre compte',
        html: `<p>Merci de vous être inscrit! Veuillez cliquer sur le lien suivant pour confirmer votre compte :</p><a href="https://techheaven.com/confirmation?token=${token}">Confirmer</a>`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw Error("Erreur lors de l\'envoi de l\'email");
    }
}

export const sendNotificationEmail = async (userEmail) => {
    const mailOptions = {
        from: COMPANY_MAIL,
        to: userEmail,
        subject: 'Compte bloqué',
        html: '<p>Votre compte a été bloqué temporairement en raison de trop de tentatives de connexion infructueuses. Veuillez réessayer dans 15 minutes.</p>'
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw Error("Erreur lors de l\'envoi de l\'email");
    }
}

export default transporter;