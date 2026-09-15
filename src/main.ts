import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module.js';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api/v1");

  await app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

await bootstrap();