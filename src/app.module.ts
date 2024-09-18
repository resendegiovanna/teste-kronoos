import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateServive } from './validate/validate.service';
import { currencyFormatterService } from './utils/formatter';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, validateServive, currencyFormatterService],
})
export class AppModule {}
