// backend/src/main.ts
import { Handler } from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from './app.module';

const server = express();


export const handler: Handler = async (req, res) => {
  if (!server.locals.nestApp) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.enableCors();
    await app.init();
    server.locals.nestApp = app;
  }
  server(req, res);
};