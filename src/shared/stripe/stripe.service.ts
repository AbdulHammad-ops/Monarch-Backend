import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_API_KEY);
  }

  async createCustomer(customerDetails: User): Promise<Stripe.Customer> {
    const { name, email, address } = customerDetails;
    const customer = await this.stripe.customers.create({
      name,
      email: email,
    });
    return customer;
  }

  async getProducts(): Promise<Stripe.Product[]> {
    const products = await this.stripe.products.list();
    return products.data;
  }

  async getCustomerById(
    id: string,
  ): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
    const customer = await this.stripe.customers.retrieve(id);
    return customer;
  }

  async createCheckoutSession(customer: string, price: string) {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customer,
      subscription_data: {
        trial_period_days: 7,
      },
      line_items: [{ price, quantity: 1 }],

      success_url: `https://monarch-backend-b0ib.onrender.com/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://monarch-backend-b0ib.onrender.com/failed`,
    });

    return session;
  }

  async createWebhook(rawBody: any, sig: any) {
    const event = Stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    return event;
  }
}
