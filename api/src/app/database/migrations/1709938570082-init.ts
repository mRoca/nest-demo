import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1709938570082 implements MigrationInterface {
  name = 'Init1709938570082';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`promocodes\`
       (
           \`id\`                  char(36)     NOT NULL,
           \`name\`                varchar(255) NOT NULL,
           \`reductionPercentage\` int          NOT NULL,
           \`restrictions\`        json         NOT NULL,
           INDEX                   \`IDX_26c5af78a50bcc0cb65c0cf73b\` (\`name\`),
           PRIMARY KEY (\`id\`)
       ) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_26c5af78a50bcc0cb65c0cf73b\` ON \`promocodes\``,
    );
    await queryRunner.query(`DROP TABLE \`promocodes\``);
  }
}
