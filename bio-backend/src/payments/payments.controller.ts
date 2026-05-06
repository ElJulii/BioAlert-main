import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-checkout')
  async createCheckout(
    @Body('amount') amount: string,
    @Req() req
  ) {
    const userId = req.user?.sub;
    return this.paymentsService.createCheckoutSession(Number(amount), userId);
  }

  @Get('total')
  async getTotalDonations() {
    return this.paymentsService.getTotalDonations()
  }
}
