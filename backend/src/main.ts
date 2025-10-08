import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Dozvoli zahtjeve s frontenda na Renderu i lokalnog Angulara
  app.enableCors({
    origin: [
      'http://localhost:4200',                  // lokalni razvoj
      'https://internet-banka-3.onrender.com',  // tvoj frontend na Renderu
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0');
  console.log(`✅ API is running on http://0.0.0.0:${port}`);
}

bootstrap();
