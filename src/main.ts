import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  const globalPrefix = configService.get<string>('app.globalPrefix', 'api/v1');
  app.setGlobalPrefix(globalPrefix);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  app.enableCors({
    origin: configService.get<string>('cors.origin', '*'),
    credentials: configService.get<boolean>('cors.credentials', true),
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Breedgestone API')
    .setDescription('Breedgestone Property Management & Marketplace API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for later reference
    )
    .addServer(`http://localhost:${configService.get<number>('app.port', 3000)}`, 'Local Development')
    .addServer('https://staging.breedgestone.com', 'Staging Server')
    .addServer('https://api.breedgestone.com', 'Production Server')
    .addTag('Auth', 'Authentication endpoints (Login, Register, OAuth, Password Reset)')
    .addTag('Users', 'User management endpoints')
    .addTag('Notifications', 'Notification management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Save OpenAPI JSON file (for Postman import)
  const outputPath = path.resolve(process.cwd(), 'swagger.json');
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2), { encoding: 'utf8' });
  console.log(`✅ Swagger JSON saved to: ${outputPath}`);

  // Serve Swagger UI at /api/docs
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keep JWT token after page refresh
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Breedgestone API Docs',
  });

  const port = configService.get<number>('app.port', 3000);
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger UI available at: http://localhost:${port}/api/docs`);
  console.log(`📄 OpenAPI JSON: http://localhost:${port}/api/docs-json`);
}
bootstrap();
