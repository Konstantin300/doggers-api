import { Controller, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import SentryInterceptor from './interceptors/sentry.interceptors';

@UseInterceptors(SentryInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
