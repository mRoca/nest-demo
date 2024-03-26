import { ConsoleLogger } from '@nestjs/common';
import { DataSource, Migration } from 'typeorm';
import { defaultDataSource } from '@/app/database/datasource';
import { Config, LOGGER_TYPE } from '@/Config';
import { JsonLogger } from '@/app/logger/JsonLogger';

/*
 * Usage:
 *   node dist/runMigrations
 *   node -r ts-node/register -r tsconfig-paths/register src/runMigrations.ts
 *   npx ts-node -r tsconfig-paths/register src/runMigrations.ts
 *   DATABASE_LOGGING=true <script>
 *   LOGGER=json <script>
 */

const logger =
  Config.LOGGER === LOGGER_TYPE.JSON
    ? new JsonLogger('DB')
    : new ConsoleLogger('DB');

const dataSources = { default: defaultDataSource };

const runMigrationsForSource = async (
  sourceName: string,
  dataSource: DataSource,
): Promise<void> => {
  const withAdvisoryLock = async <ResultType>(
    lockName: string,
    dataSource: DataSource,
    callback: () => Promise<ResultType>,
  ): Promise<ResultType> => {
    try {
      const lockResult = await dataSource.query(
        `SELECT GET_LOCK('${lockName}', 0) as locked`,
      );
      if (lockResult[0]?.locked !== '1') {
        throw new Error(
          `[${sourceName}] Failed to get lock. Another migration is currently running.`,
        );
      }
    } catch (e: unknown) {
      logger.error(`[${sourceName}] ${(e as Error).message || e}`);
      throw e;
    }

    try {
      return await callback();
    } finally {
      const releaseResult = await dataSource.query(
        `SELECT RELEASE_LOCK('${lockName}') as released`,
      );
      if (releaseResult[0]?.released !== '1') {
        logger.warn(
          `[${sourceName}] Advisory lock ${lockName} has not been unlocked`,
        );
      }
    }
  };

  const logMigrations = (
    dataSource: DataSource,
    appliedMigrations: Migration[],
  ): void => {
    if (!appliedMigrations.length) {
      logger.log(`[${sourceName}] No migrations to apply`);
    }
    appliedMigrations.forEach((migration: Migration) =>
      logger.log(`[${sourceName}] [OK] ${migration.name}`),
    );
  };

  const openConnectionAndRunMigrations = async (
    dataSource: DataSource,
  ): Promise<void> => {
    try {
      dataSource.setOptions({ migrationsRun: false, synchronize: false });
      await dataSource.initialize();
    } catch (e: unknown) {
      logger.error(`[${sourceName}] ${(e as Error).message || e}`);
      throw e;
    }

    try {
      await withAdvisoryLock(`mig-${sourceName}`, dataSource, async () => {
        const appliedMigrations = await dataSource.runMigrations({
          transaction: 'all',
        });
        logMigrations(dataSource, appliedMigrations);
      });
    } finally {
      await dataSource.destroy();
    }
  };

  await openConnectionAndRunMigrations(dataSource);
};

const migrateAllDataSources = async (): Promise<void> => {
  await Promise.allSettled(
    Object.entries(dataSources).map(([name, source]) =>
      runMigrationsForSource(name, source),
    ),
  );
};

migrateAllDataSources();
