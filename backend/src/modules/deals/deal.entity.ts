// src/modules/deals/deal.entity.ts
import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../users/user.entity';
import { Pipeline } from '../pipelines/pipeline.entity';
import { Contact } from '../contacts/contact.entity';

interface NotionMetadata {
  pageId?: string;
  databaseId?: string;
  lastSync?: Date;
}

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

  get stage(): { name: string } | undefined {
    console.log('StageId du deal:', this.stageId);
    console.log('Pipeline:', this.pipeline);
    
    if (!this.pipeline) {
      console.log('Pipeline est undefined');
      return { name: 'N/A (pas de pipeline)' };
    }
    
    console.log('Stages dans pipeline:', this.pipeline.stages);
    
    if (!this.pipeline.stages || !Array.isArray(this.pipeline.stages)) {
      console.log('Stages n\'existe pas ou n\'est pas un tableau');
      return { name: 'N/A (pas de stages)' };
    }
    
    const foundStage = this.pipeline.stages.find(s => s.id === this.stageId);
    console.log('Stage trouvé:', foundStage);
    
    return foundStage || { name: 'N/A (stage non trouvé)' };
  }

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
  notionMetadata: NotionMetadata;
}