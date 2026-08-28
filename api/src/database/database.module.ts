import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

export const DRIZZLE = Symbol('DRIZZLE');

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbPath = configService.get<string>('DATABASE_URL') || 'sqlite.db';
        const sqlite = new Database(dbPath);
        return drizzle(sqlite, { schema });
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}