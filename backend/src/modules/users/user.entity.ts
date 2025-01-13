// src/modules/users/user.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';

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

  @Column({ default: false })
  isActive: boolean;
}