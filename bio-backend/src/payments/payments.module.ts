import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaService } from 'src/prisma.service';
import { WebhookController } from './webhook/webhook.controller';

@Module({
  controllers: [PaymentsController, WebhookController],
  providers: [PaymentsService, PrismaService],
})
export class PaymentsModule {}
