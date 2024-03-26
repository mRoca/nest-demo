import { DataSource } from 'typeorm';
import { Config } from '@/Config';

/**
 * Usage:
 *   npm run typeorm migration:generate src/app/database/migrations/<migration-name>
 *   ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d src/app/database/datasource.ts migration:generate <file>
 */
export const defaultDataSource = new DataSource(Config.getDataSourceOptions());
