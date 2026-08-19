import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { env } from 'process';
import { link } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({ 
    origin: 'https://sistema-de-reservas-gamma.vercel.app/'
  });
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Seed a Bit - Sistema de Reserva de Salas')
    .setDescription('API para gerenciamento de salas e reservas com proteção JWT e regras de conflito.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3003, '0.0.0.0');
  console.log("API running on: http://localhost:" + process.env.PORT + "/api");
  console.log("API running on: http://localhost:" + process.env.PORT + "/api/docs");
  console.log("Frontend running on: http://localhost:" + process.env.FRONTEND_PORT);
}
bootstrap();
