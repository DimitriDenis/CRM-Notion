// src/config/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config(); // Charge les variables d'environnement

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.get('DATABASE_URL'),
  autoLoadEntities: true,
  synchronize: configService.get('NODE_ENV') !== 'production',
  logging: configService.get('NODE_ENV') === 'development',
  migrations: [join(__dirname, '../migrations/**/*.{ts,js}')],
  migrationsRun: true, // Exécute automatiquement les migrations au démarrage
  migrationsTableName: 'migrations',
});

// Configuration pour les CLI migrations
export const getDataSourceConfig = (): DataSourceOptions => ({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [join(__dirname, '../**/*.entity.{ts,js}')],
  migrations: [join(__dirname, '../migrations/**/*.{ts,js}')],
  migrationsTableName: 'migrations',
});

// Export pour la CLI TypeORM
export default new DataSource(getDataSourceConfig());