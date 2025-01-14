// src/modules/contacts/contact.entity.ts
import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../users/user.entity';
import { Tag } from '../tags/tag.entity';

@Entity('contacts')
export class Contact extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  company: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.contacts)
  user: User;

  @ManyToMany(() => Tag)
  @JoinTable({
    name: 'contacts_tags',
    joinColumn: { name: 'contact_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @Column({ type: 'jsonb', nullable: true })
  customFields: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  notionMetadata: {
    pageId: string;
    lastSync: Date;
  };
}