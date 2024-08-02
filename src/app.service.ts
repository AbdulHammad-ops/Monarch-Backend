import { Injectable } from '@nestjs/common';
import { StripeService } from './shared/stripe/stripe.service';
import { UsersService } from './users/users.service';
import { productToPriceMap } from './config/constants';

@Injectable()
export class AppService {
  constructor(
    private stripeService: StripeService,
    private userService: UsersService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getUser(id: string) {
    return await this.userService.getUserById(id);
  }

  async webhook(req: Request) {
    let event = null;

    try {
      // console.log(req.headers.get('stripe-signature'));
      event = this.stripeService.createWebhook(
        req.body,
        req.headers.get('stripe-signature'),
      );
    } catch (err) {
      console.log(err);
    }
    const data = event.data.object;
    console.log(event.type, data);
    switch (event.type) {
      case 'customer.subscription.created': {
        const user = await this.userService.getUserByStripeId(data.customer);
        if (data.plan.id === productToPriceMap.BASIC) {
          user.plan = 'BASIC';
          this.userService.updateUserPackage(user.id, 'BASIC');
        }
        if (data.plan.id === productToPriceMap.PRO) {
          user.plan = 'PREMIUM';
          this.userService.updateUserPackage(user.id, 'BASIC');
        }
        break;
      }
      default:
    }
  }
}
