import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common';
import express, { Request, Response } from 'express';
import { AppModule } from './app.module';

const server = express();
let nestApp: INestApplication;  // ✅ Tipo explícito

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors();
  await app.init();
  nestApp = app;
}
bootstrap();

export default async function handler(req: Request, res: Response) {
  if (!nestApp) {
    await bootstrap();
  }
  server(req, res);
}
