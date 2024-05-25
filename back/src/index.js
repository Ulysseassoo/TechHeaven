import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import UserRoute from "./routes/users.mjs"
import productRoutes from "./routes/product.mjs";
import categoryRoutes from "./routes/category.mjs";
import cron from "node-cron";
import { postgresqlDb } from "./utils/db.server.mjs";
import { sendPasswordRenewalNotification } from "./utils/mailer.mjs";


dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT = parseInt(process.env.PORT, 10);

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/", UserRoute);
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);

const checkPasswordRenewal = async () => {
  const accountsToRenew = await postgresqlDb.user.findMany();
  
  for (let i = 0; i < accountsToRenew.length; i++) {
    const user = accountsToRenew[i];
    
    const lastPasswordChange = new Date(user.last_updated_password);
    const sixtyDaysAgo = new Date();
    
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    if (lastPasswordChange <= sixtyDaysAgo) {
      // Envoyer une notification à l'utilisateur pour le renouvellement du mot de passe
      sendPasswordRenewalNotification(user.email);
      console.log(`Envoyer une notification de renouvellement du mot de passe à ${user.email}`);
    }
  }
}

// Verify the password renewal every 24h
cron.schedule('0 0 * * *', () => {
  console.log('Exécution de la vérification du renouvellement du mot de passe...');
  checkPasswordRenewal();
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
