import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCrmEntities1736848253953 implements MigrationInterface {
    name = 'AddCrmEntities1736848253953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying, "company" character varying, "notes" text, "userId" uuid NOT NULL, "customFields" jsonb, "notionMetadata" jsonb, CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "deals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "value" numeric(10,2) NOT NULL, "stageId" character varying NOT NULL, "expectedCloseDate" date, "pipelineId" uuid NOT NULL, "userId" uuid NOT NULL, "customFields" jsonb, "notionMetadata" jsonb, CONSTRAINT "PK_8c66f03b250f613ff8615940b4b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pipelines" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "stages" jsonb NOT NULL, "userId" uuid NOT NULL, "notionMetadata" jsonb, CONSTRAINT "PK_e38ea171cdfad107c1f3db2c036" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "color" character varying, "userId" uuid NOT NULL, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contacts_tags" ("contact_id" uuid NOT NULL, "tag_id" uuid NOT NULL, CONSTRAINT "PK_19febdfdd5f1f5c3492d7ee8f78" PRIMARY KEY ("contact_id", "tag_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f852029a1d759b5405a8a264bf" ON "contacts_tags" ("contact_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_48c3bbfaa2eb032ad7a7fc0840" ON "contacts_tags" ("tag_id") `);
        await queryRunner.query(`CREATE TABLE "deals_contacts" ("deal_id" uuid NOT NULL, "contact_id" uuid NOT NULL, CONSTRAINT "PK_18b9eba046512c1934a839707ab" PRIMARY KEY ("deal_id", "contact_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_94cdc1a76ade6e2edbdcbe0ddc" ON "deals_contacts" ("deal_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_18b2c3d95777957e6867b03dc8" ON "deals_contacts" ("contact_id") `);
        await queryRunner.query(`ALTER TABLE "contacts" ADD CONSTRAINT "FK_30ef77942fc8c05fcb829dcc61d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_b2ff80a8e663c39f7b37a9d2000" FOREIGN KEY ("pipelineId") REFERENCES "pipelines"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_2ab80c329115e938c396ed5d418" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pipelines" ADD CONSTRAINT "FK_3678fa66f9741528fe34f6d7abc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tags" ADD CONSTRAINT "FK_92e67dc508c705dd66c94615576" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contacts_tags" ADD CONSTRAINT "FK_f852029a1d759b5405a8a264bfb" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "contacts_tags" ADD CONSTRAINT "FK_48c3bbfaa2eb032ad7a7fc08404" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "deals_contacts" ADD CONSTRAINT "FK_94cdc1a76ade6e2edbdcbe0ddce" FOREIGN KEY ("deal_id") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "deals_contacts" ADD CONSTRAINT "FK_18b2c3d95777957e6867b03dc89" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deals_contacts" DROP CONSTRAINT "FK_18b2c3d95777957e6867b03dc89"`);
        await queryRunner.query(`ALTER TABLE "deals_contacts" DROP CONSTRAINT "FK_94cdc1a76ade6e2edbdcbe0ddce"`);
        await queryRunner.query(`ALTER TABLE "contacts_tags" DROP CONSTRAINT "FK_48c3bbfaa2eb032ad7a7fc08404"`);
        await queryRunner.query(`ALTER TABLE "contacts_tags" DROP CONSTRAINT "FK_f852029a1d759b5405a8a264bfb"`);
        await queryRunner.query(`ALTER TABLE "tags" DROP CONSTRAINT "FK_92e67dc508c705dd66c94615576"`);
        await queryRunner.query(`ALTER TABLE "pipelines" DROP CONSTRAINT "FK_3678fa66f9741528fe34f6d7abc"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_2ab80c329115e938c396ed5d418"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_b2ff80a8e663c39f7b37a9d2000"`);
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "FK_30ef77942fc8c05fcb829dcc61d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_18b2c3d95777957e6867b03dc8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_94cdc1a76ade6e2edbdcbe0ddc"`);
        await queryRunner.query(`DROP TABLE "deals_contacts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_48c3bbfaa2eb032ad7a7fc0840"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f852029a1d759b5405a8a264bf"`);
        await queryRunner.query(`DROP TABLE "contacts_tags"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "pipelines"`);
        await queryRunner.query(`DROP TABLE "deals"`);
        await queryRunner.query(`DROP TABLE "contacts"`);
    }

}
