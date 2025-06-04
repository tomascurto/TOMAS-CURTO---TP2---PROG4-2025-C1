// backend/src/main.ts
import { Handler } from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from './app.module';

const expressApp = express();
const adapter = new ExpressAdapter(expressApp);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, adapter);
  await app.listen(process.env.PORT ?? 3000);
  app.enableCors();
  await app.init();
}
bootstrap();

export const handler: Handler = expressApp;