import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    enableDebugMessages: true, // Pour voir plus de détails sur les erreurs
    exceptionFactory: (errors) => {
      
      return errors;
    }
  }));

  // Ajouter ce middleware de logging
  app.use((req, res, next) => {
    console.log('=== Incoming Request ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Query:', req.query);
    console.log('Headers:', {
      ...req.headers,
      authorization: req.headers.authorization ? 'present' : 'absent'
    });
    next();
  });

  app.use(
    session({
      secret: process.env.TEST_SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60000 * 60 * 24
      }
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    origin: ['http://localhost:3000', 'https://crm-notion-b6j8.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();