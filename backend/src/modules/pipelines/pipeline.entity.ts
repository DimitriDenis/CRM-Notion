// src/modules/pipelines/pipeline.entity.ts
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../users/user.entity';
import { Deal } from '../deals/deal.entity';

@Entity('pipelines')
export class Pipeline extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'jsonb' })
  stages: {
    id: string;
    name: string;
    order: number;
  }[];

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.pipelines)
  user: User;

  @OneToMany(() => Deal, deal => deal.pipeline)
  deals: Deal[];

  @Column({ type: 'jsonb', nullable: true })
  notionMetadata: {
    databaseId: string;
    lastSync: Date;
  };
}