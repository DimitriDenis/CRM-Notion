// src/modules/tags/tag.entity.ts
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../users/user.entity';

@Entity('tags')
export class Tag extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  color: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.tags)
  user: User;
}