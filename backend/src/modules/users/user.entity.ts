// src/modules/users/user.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Contact } from '../contacts/contact.entity';
import { Tag } from '../tags/tag.entity';
import { Pipeline } from '../pipelines/pipeline.entity';
import { Deal } from '../deals/deal.entity';

export enum UserPlan {
  FREE = 'free',
  PRO = 'pro',
}

@Entity('users')
export class User extends BaseEntity {
  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  notionUserId: string;

  @Column()
  notionAccessToken: string;

  @Column()
  notionWorkspaceId: string;

  @Column({
    type: 'enum',
    enum: UserPlan,
    default: UserPlan.FREE,
  })
  plan: UserPlan;

  @OneToMany(() => Contact, contact => contact.user)
  contacts: Contact[];

  @OneToMany(() => Tag, tag => tag.user)
  tags: Tag[];

  @OneToMany(() => Pipeline, pipeline => pipeline.user)
  pipelines: Pipeline[];

  @OneToMany(() => Deal, deal => deal.user)
  deals: Deal[];

  @Column({ default: false })
  isActive: boolean;
}