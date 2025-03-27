import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveDealStatusUniqueConstraint1711555555555 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Supprime la contrainte d'unicité sur la colonne status
        await queryRunner.query(`ALTER TABLE deals DROP CONSTRAINT IF EXISTS deals_status_key`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Optionnel: restaurer la contrainte si nécessaire
        // await queryRunner.query(`ALTER TABLE deals ADD CONSTRAINT deals_status_key UNIQUE (status)`);
    }
}