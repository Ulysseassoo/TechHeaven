import express from 'express';
import { db } from "../utils/db.server.mjs";
import { shouldBeAuthenticate } from '../middlewares/authentication.mjs';
import { generatePaymentLink } from './../utils/payment.js'

const router = express.Router();
  
  router.get("/paylink", shouldBeAuthenticate, async (req, res) => {
    try {
      const user = req.user 

      const basket = await db.cart.findFirst({
        where: {
          user_id: user.id
        }
      })
  
      if (!basket) {
        return res.status(404).json({ message: "Panier non trouvé." });
      }

      const products = await db.cartHasProducts.findMany({
        where: {
          cart_id: basket.id
        },
        include: {
          product: true
        }
      })
      if (!products.length) {
        return res.status(400).json({ message: "Panier vide." });
      }

      const productsForStipe = products.map((product) => {
        return {
          price_data: {
            currency: 'eur',
            product_data: {
              name: product.product.name
            },
            unit_amount: product.product.price * 100
          },
          quantity: product.quantity
        }
      }) 

      const paymentLink = await generatePaymentLink(productsForStipe);
  
      return res.status(200).json({ status: 200, data: {link: paymentLink} });
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors de la génération du lien de paiement", error: error.message });
    }
  });

  export default router