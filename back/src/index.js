import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import UserRoute from "./routes/users.mjs";
import ProductRoutes from "./routes/product.mjs";
import CategoryRoutes from "./routes/category.mjs";
import OrderRoutes from "./routes/order.mjs";
import InvoiceRoutes from "./routes/invoice.mjs";
import SecurityRoutes from "./routes/auth.mjs";
import AddressRoutes from "./routes/addresses.mjs";
import DeliveryRoutes from "./routes/delivery.mjs";
import deliveryRoutes from "./routes/delivery.mjs";
import PromotionRoutes from "./routes/promotion.mjs";
import cron from "node-cron";
import { db } from "./utils/db.server.mjs";
import { sendPasswordRenewalNotification } from "./utils/mailer.mjs";
import mongoose from "./middlewares/mongooseConfig.mjs";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT = parseInt(process.env.PORT, 10);

const app = express();

app.use(express.json());

const corsOptions = {
  origin: process.env.WEBSITE_URL,
  optionsSuccessStatus: 200
};


app.use(cors(corsOptions));

// Routes
app.use("/api", UserRoute);
app.use("/api", ProductRoutes);
app.use("/api", CategoryRoutes);
app.use("/api", OrderRoutes);
app.use("/api", InvoiceRoutes);
app.use("/api", SecurityRoutes);
app.use("/api", AddressRoutes);
app.use("/api", DeliveryRoutes);
app.use('/api', deliveryRoutes);
app.use("/api", PromotionRoutes);

const checkPasswordRenewal = async () => {
  const accountsToRenew = await db.user.findMany();

  for (let i = 0; i < accountsToRenew.length; i++) {
    const user = accountsToRenew[i];

    const lastPasswordChange = new Date(user.last_updated_password);
    const sixtyDaysAgo = new Date();

    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    if (lastPasswordChange <= sixtyDaysAgo) {
      // Envoyer une notification à l'utilisateur pour le renouvellement du mot de passe
      sendPasswordRenewalNotification(user.email);
      console.log(
        `Envoyer une notification de renouvellement du mot de passe à ${user.email}`
      );
    }
  }
};

// Verify the password renewal every 24h
cron.schedule("0 0 * * *", () => {
  console.log(
    "Exécution de la vérification du renouvellement du mot de passe..."
  );
  checkPasswordRenewal();
});

// Connect to mongo database
mongoose.connect(process.env.DATABASE_URL_MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
