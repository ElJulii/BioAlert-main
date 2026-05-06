import { Controller, Post, Req } from '@nestjs/common';
import Stripe from 'stripe';
import type { Request } from 'express';
import { PrismaService } from 'src/prisma.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

@Controller('payments/webhook')
export class WebhookController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handleWebhook(@Req() req: Request) {
    const sig = req.headers['stripe-signature'] as string;

    let event: any;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (error: any) {
      throw new Error(`Webhook Error: ${error.message}`);
    }

    // 💰 SOLO AQUÍ se guarda la donación
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;

      await this.prisma.donation.create({
        data: {
          amount: session.amount_total! / 100,
          currency: session.currency!,
          stripeId: session.id,
        },
      });

      console.log('💰 Donation saved:', session.id);
    }

    return { received: true };
  }
}
