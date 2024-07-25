import Stripe from 'stripe';
import dotenv from "dotenv";

dotenv.config();

export const generatePaymentLink = async (products) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products,
      mode: 'payment',
      success_url: `${process.env.WEBSITE_URL}/payment/success`, 
      cancel_url: `${process.env.WEBSITE_URL}/order`
    });
  
    return session.url;
  };