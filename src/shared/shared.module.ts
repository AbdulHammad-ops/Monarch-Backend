import { Module } from '@nestjs/common';
import { StripeModule } from './stripe/stripe.module';
import { StripeService } from './stripe/stripe.service';

@Module({
  imports: [StripeModule.forRootAsync()],
  providers: [StripeService],
  exports: [StripeService],
})
export class SharedModule {}
