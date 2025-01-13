import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1736800851662 implements MigrationInterface {
    name = 'InitialSchema1736800851662'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_plan_enum" AS ENUM('free', 'pro')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "name" character varying NOT NULL, "notionUserId" character varying NOT NULL, "notionAccessToken" character varying NOT NULL, "notionWorkspaceId" character varying NOT NULL, "plan" "public"."users_plan_enum" NOT NULL DEFAULT 'free', "isActive" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_plan_enum"`);
    }

}
