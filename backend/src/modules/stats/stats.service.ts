// src/modules/stats/stats.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../contacts/contact.entity';
import { Deal } from '../deals/deal.entity';
import { LessThan } from 'typeorm';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectRepository(Deal)
    private dealRepository: Repository<Deal>,
  ) {}

  async getDashboardStats(userId: string) {
    const [
      totalContacts,
      totalDeals,
      dealsWithValue,
      lastMonthContacts,
      lastMonthDeals,
      lastMonthValue,
    ] = await Promise.all([
      this.contactRepository.count({ where: { userId } }),
      this.dealRepository.count({ where: { userId } }),
      this.dealRepository.find({ where: { userId } }),
      this.getLastMonthStats(userId),
      this.getLastMonthDeals(userId),
      this.getLastMonthValue(userId),
    ]);

    const totalValue = dealsWithValue.reduce((sum, deal) => sum + deal.value, 0);

    return {
      totalContacts,
      totalDeals,
      totalValue,
      trends: {
        contacts: this.calculateTrend(totalContacts, lastMonthContacts),
        deals: this.calculateTrend(totalDeals, lastMonthDeals),
        value: this.calculateTrend(totalValue, lastMonthValue),
      },
    };
  }

  private calculateTrend(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  private async getLastMonthStats(userId: string): Promise<number> {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    return this.contactRepository.count({
      where: {
        userId,
        createdAt: LessThan(lastMonth),
      },
    });
  }

  private async getLastMonthDeals(userId: string): Promise<number> {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    return this.contactRepository.count({
      where: {
        userId,
        createdAt: LessThan(lastMonth),
      },
    });
  }

  private async getLastMonthValue(userId: string): Promise<number> {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    return this.contactRepository.count({
      where: {
        userId,
        createdAt: LessThan(lastMonth),
      },
    });
  }

  
}