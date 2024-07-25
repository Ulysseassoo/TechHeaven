import Stripe from 'stripe';
import dotenv from "dotenv";

dotenv.config();

export const generatePaymentLink = async (products) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products,
      mode: 'payment',
      success_url: `http://localhost:5173/payment/success`, // A changer au moment de la prod les gars ! 
      cancel_url: `http://localhost:5173/order`// A changer au moment de la prod les gars ! 
    });
  
    return session.url;
  };