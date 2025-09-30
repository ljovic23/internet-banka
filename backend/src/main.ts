import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // CORS uključen radi frontenda
  const app = await NestFactory.create(AppModule, { cors: true });

  const port = Number(process.env.PORT) || 3000;

  // ⬅️ Forsiramo IPv4 bind kako bi Windows "localhost" (koji zna ići na ::1) radio bez greške
  await app.listen(port, '0.0.0.0');

  const url = `http://127.0.0.1:${port}`;
  console.log('\n========================================');
  console.log(`✅ API listening at ${url}`);
  console.log('========================================\n');
}
bootstrap();
