import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module.js';
import {ValidationPipe} from "@nestjs/common";
import helmet from "helmet";
import {HttpExceptionFilter} from "./common/filters/http-exception.filter.js";
import {LogDetailsInterceptor} from "./common/interceptors/log-details/log-details.interceptor.js";

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors();

  app.setGlobalPrefix("api/v1");
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LogDetailsInterceptor())

  await app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

await bootstrap();