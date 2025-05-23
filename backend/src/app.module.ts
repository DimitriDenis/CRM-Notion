// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from './config/app.config';
import { getTypeOrmConfig } from './config/typeorm.config';
import { validate } from './config/env.validation';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { PipelinesModule } from './modules/pipelines/pipelines.module';
import { DealsModule } from './modules/deals/deals.module';
import { TagsModule } from './modules/tags/tags.module';
import { TestModule } from './modules/test/test.module';
import { NotionModule } from './modules/notion/notion.module';
import { StatsModule } from './modules/stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validate,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    AuthModule,
    UsersModule,
    NotionModule,
    ContactsModule,
    PipelinesModule,
    DealsModule,
    TagsModule,
    StatsModule,
    ...(process.env.NODE_ENV !== 'production' ? [TestModule] : []),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}