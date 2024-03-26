import { Logger } from '@nestjs/common';
import {
  IsBoolean,
  isDefined,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { DataSourceOptions } from 'typeorm';
import { promoCodeEntities } from '@/promocode/PromoCodeModule';
import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';

export enum LOGGER_TYPE {
  CONSOLE = 'console',
  JSON = 'json',
}

// Small hack avoiding installing jq in docker container
if (
  isDefined(process.env.INJECTED_COPILOT_DATABASE_SECRET) &&
  isDefined(process.env[process.env.INJECTED_COPILOT_DATABASE_SECRET])
) {
  const dbConfig: Record<string, string> = JSON.parse(
    process.env[process.env.INJECTED_COPILOT_DATABASE_SECRET],
  );
  process.env.DATABASE_HOST = dbConfig.host ?? process.env.DATABASE_HOST;
  process.env.DATABASE_PORT = dbConfig.port ?? process.env.DATABASE_PORT;
  process.env.DATABASE_NAME = dbConfig.dbname ?? process.env.DATABASE_NAME;
  process.env.DATABASE_USER = dbConfig.username ?? process.env.DATABASE_USER;
  process.env.DATABASE_PASSWORD =
    dbConfig.password ?? process.env.DATABASE_PASSWORD;
}

class Configuration {
  @IsString()
  @IsEnum(LOGGER_TYPE)
  readonly LOGGER = (process.env.LOGGER || LOGGER_TYPE.CONSOLE) as string;
  @IsString()
  @IsOptional()
  readonly OPEN_WEATHER_MAP_API_TOKEN = process.env
    .OPEN_WEATHER_MAP_API_TOKEN as string;
  @IsString()
  readonly DATABASE_HOST = (process.env.DATABASE_HOST ?? 'localhost') as string;
  @IsInt()
  readonly DATABASE_PORT = Number(process.env.DATABASE_PORT ?? 3306);
  @IsString()
  readonly DATABASE_NAME = process.env.DATABASE_NAME as string;
  @IsString()
  readonly DATABASE_USER = process.env.DATABASE_USER as string;
  @IsString()
  readonly DATABASE_PASSWORD = process.env.DATABASE_PASSWORD as string;
  @IsBoolean()
  readonly DATABASE_LOGGING = process.env.DATABASE_LOGGING === 'true';
  @IsBoolean()
  readonly DATABASE_RUN_MIGRATIONS =
    process.env.DATABASE_RUN_MIGRATIONS === 'true';
  @IsInt()
  readonly HTTP_PORT = Number(process.env.HTTP_PORT ?? 3000);
  private readonly logger = new Logger(Configuration.name);

  constructor() {
    const error = validateSync(this);
    if (!error.length) return;
    this.logger.error(`Config validation error: ${JSON.stringify(error)}`);
    process.exit(1);
  }

  getDataSourceOptions(): DataSourceOptions & TypeOrmModuleOptions {
    return {
      type: 'mysql',
      entities: [...promoCodeEntities],
      charset: 'utf8mb4_unicode_ci',
      logging: Config.DATABASE_LOGGING,
      host: Config.DATABASE_HOST,
      port: Config.DATABASE_PORT,
      database: Config.DATABASE_NAME,
      username: Config.DATABASE_USER,
      password: Config.DATABASE_PASSWORD,
      migrations: [join(`${__dirname}/app/database/migrations`, '*{.ts,.js}')],
      migrationsRun: Config.DATABASE_RUN_MIGRATIONS,
      // module
      retryAttempts: 1,
      retryDelay: 1000,
      verboseRetryLog: true,
      autoLoadEntities: true,
    };
  }
}

export const Config = new Configuration();
