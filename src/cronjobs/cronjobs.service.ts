import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
@Injectable()
export class CronjobsService {
  @Cron(CronExpression.EVERY_6_MONTHS)
  updateUserSubscription() {}
}
