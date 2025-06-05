// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common';
import express, { Request, Response } from 'express';
import { AppModule } from './app.module';

const server = express();

server.get('/favicon.ico', (_req, res) => {
  res.status(204).end();
});
let nestApp: INestApplication;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors();
  await app.init();
  nestApp = app;
  app.enableCors({
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization,X-Requested-With,Accept-Language",
  optionsSuccessStatus: 204,
  credentials: true,
});
}
bootstrap();

export default async function handler(req: Request, res: Response) {
  if (!nestApp) {
    await bootstrap();
  }
  server(req, res); 
}
