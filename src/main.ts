import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger } from './utils/winston-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  console.log('##### APLICAÇÃO INICIADA #####');
  winstonLogger.info('##### APLICAÇÃO INICIADA #####');
  await app.listen(3000);
}
bootstrap();
