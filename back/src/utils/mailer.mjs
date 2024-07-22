import nodemailer from "nodemailer";
import { COMPANY_MAIL } from "../constants/index.mjs";
import { generateInvoicePDF } from './pdfGenerator.mjs';
import fs from 'fs';

const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

const transporterOptions = {
    host: process.env.SMTP_HOST || "localhost",
    port: process.env.SMTP_PORT || 1025,
};
  
if (user !== "" && pass !== "") {
    transporterOptions.auth = { user, pass }; 
}

const transporter = nodemailer.createTransport(transporterOptions);

export const sendConfirmationEmail = async (userEmail, token) => {
    const mailOptions = {
        from: COMPANY_MAIL,
        to: userEmail,
        subject: 'Confirmation de votre compte',
        html: `<p>Merci de vous être inscrit! Veuillez cliquer sur le lien suivant pour confirmer votre compte :</p><a href="${process.env.WEBSITE_URL}/confirmation?token=${token}">Confirmer</a>`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("🚀 ~ sendConfirmationEmail ~ error:", error)
        console.log("🚀 ~ sendConfirmationEmail ~ error:", error.message)
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

export const sendPasswordRenewalNotification = async (userEmail) => {
    const mailOptions = {
        from: COMPANY_MAIL,
        to: userEmail,
        subject: 'Demande de renouvellement de mot de passe',
        html: `
        <h1>Changement de mot de passe requis</h1>
        <p>Bonjour,</p>
        <p>Nous vous contactons pour vous informer qu'il est nécessaire de changer votre mot de passe pour des raisons de sécurité. Il est recommandé de changer régulièrement votre mot de passe pour protéger votre compte.</p>
        <p>Pour changer votre mot de passe, veuillez cliquer sur le lien ci-dessous :</p>
        <p><a href="${process.env.WEBSITE_URL}/account/profile?changePassword=true">Changer mon mot de passe</a></p>
        <p>Si vous n'avez pas demandé ce changement, veuillez contacter notre service clientèle immédiatement.</p>
        <p>Merci,</p>
        <p>L'équipe de techheaven.com</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw Error("Erreur lors de l\'envoi de l\'email");
    }
}

export const sendPasswordResetEmail = async (userEmail, code) => {
    const mailOptions = {
        from: COMPANY_MAIL,
        to: userEmail,
        subject: 'Demande de réintialisation de mot de passe',
        html: `
        <h1>Réintialiser votre mot de passe</h1>
        <p>Pour changer votre mot de passe, veuillez renseigner le code suivant : ${code}</p>
        <p>Si vous n'avez pas demandé ce changement, veuillez contacter notre service clientèle immédiatement.</p>
        <p>Merci,</p>
        <p>L'équipe de techheaven.com</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw Error("Erreur lors de l\'envoi de l\'email");
    }
}

export const sendNewsletterEmail = async (userEmail) => {
    const mailOptions = {
        from: COMPANY_MAIL,
        to: userEmail,
        subject: 'Découvrez les Dernières Innovations avec TechHeaven !',
        html: `
          <h1>Bienvenue chez TechHeaven</h1>
          <p>Bonjour,</p>
          <p>Nous sommes ravis de vous accueillir dans notre communauté de passionnés de technologie. Chez TechHeaven, nous nous engageons à vous fournir les dernières nouvelles et innovations technologiques pour améliorer votre quotidien.</p>
          <h2>Les Dernières Nouveautés</h2>
          <ul>
            <li><strong>Gadget de la Semaine:</strong> Découvrez notre nouveau smartphone avec des fonctionnalités révolutionnaires.</li>
            <li><strong>Conseils et Astuces:</strong> Apprenez comment optimiser l'utilisation de vos appareils pour une efficacité maximale.</li>
            <li><strong>Événements à Venir:</strong> Ne manquez pas nos webinaires et ateliers exclusifs pour en savoir plus sur les tendances technologiques.</li>
          </ul>
          <h2>Rejoignez la Communauté TechHeaven</h2>
          <p>Participez à nos forums de discussion, échangez avec d'autres passionnés et obtenez des réponses à toutes vos questions techniques. Ensemble, nous pouvons pousser les limites de la technologie.</p>
          <p>Pour plus d'informations, visitez notre site web : <a href="https://tech-heaven.fr">TechHeaven</a></p>
          <p>Merci de faire partie de notre communauté !</p>
          <p>Cordialement,</p>
          <p>L'équipe TechHeaven</p>
        `
      };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error.message)
        console.error("🚀 ~ sendNewsletterEmail ~ error:", error)
        throw Error("Erreur lors de l\'envoi de l\'email");
    }
}

export const sendInvoiceEmail = async (userEmail, invoice) => {
    const pdfPath = generateInvoicePDF(invoice);
    
    const mailOptions = {
        from: COMPANY_MAIL,
        to: userEmail,
        subject: 'Votre Facture',
        html: `
        <h1>Votre Facture</h1>
        <p>Bonjour,</p>
        <p>Merci pour votre achat. Vous trouverez ci-dessous les détails de votre facture en pièce jointe :</p>
        <p>Montant total : ${invoice.amount}</p>
        <p>Merci,</p>
        <p>L'équipe de techheaven.com</p>
        `,
        attachments: [
            {
                filename: `invoice_${invoice.id}.pdf`,
                path: pdfPath,
                contentType: 'application/pdf'
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error("Erreur lors de l'envoi de la facture par email");
    } finally {
        // Supprimer le fichier PDF après envoi pour éviter d'encombrer le disque
        fs.unlinkSync(pdfPath);
    }
}


export default transporter;