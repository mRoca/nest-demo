import { defaultDataSource } from '@/app/database/datasource';
import { DataSource } from 'typeorm';

export const clearDb = async (dataSource: DataSource): Promise<void> => {
  await dataSource.query(`SET FOREIGN_KEY_CHECKS = 0`);
  for await (const entity of dataSource.entityMetadatas) {
    await dataSource.query(`TRUNCATE \`${entity.tableName}\``);
  }
  await dataSource.query(`SET FOREIGN_KEY_CHECKS = 1`);
};

export const withDatabaseContext = () => {
  beforeEach(async () => {
    if (!defaultDataSource.isInitialized) {
      defaultDataSource.setOptions({
        migrationsRun: true,
        synchronize: false,
      });
      await defaultDataSource.initialize();
    }
    await clearDb(defaultDataSource);
    await defaultDataSource.destroy();
  }, 10 * 1000);
};
