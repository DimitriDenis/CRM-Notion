// src/modules/deals/deal.entity.ts
import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../users/user.entity';
import { Pipeline } from '../pipelines/pipeline.entity';
import { Contact } from '../contacts/contact.entity';

@Entity('deals')
export class Deal extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column()
  stageId: string;

  @Column({ type: 'date', nullable: true })
  expectedCloseDate: Date;

  @Column()
  pipelineId: string;

  @ManyToOne(() => Pipeline, pipeline => pipeline.deals)
  pipeline: Pipeline;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.deals)
  user: User;

  @ManyToMany(() => Contact)
  @JoinTable({
    name: 'deals_contacts',
    joinColumn: { name: 'deal_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'contact_id', referencedColumnName: 'id' },
  })
  contacts: Contact[];

  @Column({ type: 'jsonb', nullable: true })
  customFields: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  notionMetadata: {
    pageId: string;
    lastSync: Date;
  };
}