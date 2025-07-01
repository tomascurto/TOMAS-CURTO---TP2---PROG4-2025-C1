import { Handler, Context, Callback } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { configure } from '@vendia/serverless-express';

let cachedHandler: Handler;

async function bootstrap(): Promise<Handler> {
  if (!cachedHandler) {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);
    const app = await NestFactory.create(AppModule, adapter);
    await app.init();

    cachedHandler = configure({ app: expressApp });
  }

  return cachedHandler;
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback
) => {
  const server = await bootstrap();
};
