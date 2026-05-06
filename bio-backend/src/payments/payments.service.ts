import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
    
    private stripe: any;

    constructor(
        private prisma: PrismaService
    ) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2026-04-22.dahlia',
        });
    }

    async createCheckoutSession(amount: number, userId?: number) {
        if (amount < 5) {
            throw new Error("Minimum amount is 5 USD")
        }

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Donation to BioAlert',
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            success_url: 'http://localhost:3000/charity/success',
            cancel_url: 'http://localhost:3000/charity/',
        })

        await this.prisma.donation.create({
            data: {
                amount,
                currency: "usd",
                stripeId: session.id,
                userId: userId || null,
            }
        })

        return { url: session.url }
    }


    async getTotalDonations() {
        const donations = await this.prisma.donation.findMany()

        let total: number = 0;

        for (const donation of donations) {
            total += donation.amount
        }

        return total;
    }
}
