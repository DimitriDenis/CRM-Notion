// src/modules/stats/stats.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThanOrEqual } from 'typeorm';
import { Contact } from '../contacts/contact.entity';
import { Deal } from '../deals/deal.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectRepository(Deal)
    private dealRepository: Repository<Deal>,
  ) {}

  async getDashboardStats(userId: string) {
    // Récupérer la date actuelle et calculer les périodes
    const today = new Date();
    
    // Début du mois actuel
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Début du mois précédent
    const previousMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    
    // Fin du mois précédent
    const previousMonthEnd = new Date(currentMonthStart.getTime() - 1);

    // Récupérer les stats totales
    const [totalContacts, totalDeals, allDeals] = await Promise.all([
      this.contactRepository.count({ where: { userId } }),
      this.dealRepository.count({ where: { userId } }),
      this.dealRepository.find({ where: { userId } }),
    ]);

    // Récupérer les deals gagnés (tous)
    const wonDeals = allDeals.filter(deal => deal.status === 'won');
    const totalValue = wonDeals.reduce((sum, deal) => sum + Number(deal.value), 0);

    // Récupérer les deals gagnés ce mois-ci (basé sur expectedCloseDate)
    const currentMonthWonDeals = await this.dealRepository.find({
      where: {
        userId,
        status: 'won',
        expectedCloseDate: Between(currentMonthStart, today),
      },
    });
    const currentMonthValue = currentMonthWonDeals.reduce((sum, deal) => sum + Number(deal.value), 0);

    // Récupérer les deals gagnés le mois précédent
    const previousMonthWonDeals = await this.dealRepository.find({
      where: {
        userId,
        status: 'won',
        expectedCloseDate: Between(previousMonthStart, previousMonthEnd),
      },
    });
    const previousMonthValue = previousMonthWonDeals.reduce((sum, deal) => sum + Number(deal.value), 0);

    // Récupérer les contacts créés ce mois-ci
    const currentMonthContacts = await this.contactRepository.count({
      where: {
        userId,
        createdAt: Between(currentMonthStart, today),
      },
    });

    // Récupérer les contacts créés le mois précédent
    const previousMonthContacts = await this.contactRepository.count({
      where: {
        userId,
        createdAt: Between(previousMonthStart, previousMonthEnd),
      },
    });

    // Récupérer les deals créés ce mois-ci
    const currentMonthDeals = await this.dealRepository.count({
      where: {
        userId,
        createdAt: Between(currentMonthStart, today),
      },
    });

    // Récupérer les deals créés le mois précédent
    const previousMonthDeals = await this.dealRepository.count({
      where: {
        userId,
        createdAt: Between(previousMonthStart, previousMonthEnd),
      },
    });

    // Calculer les tendances
    const contactsTrend = this.calculateTrend(currentMonthContacts, previousMonthContacts);
    const dealsTrend = this.calculateTrend(currentMonthDeals, previousMonthDeals);
    const valueTrend = this.calculateTrend(currentMonthValue, previousMonthValue);

    // Récupérer les données pour les graphiques (6 derniers mois)
    const monthlyTrendsData = await this.getMonthlyTrendsData(userId, 6);

    return {
      totalContacts,
      totalDeals,
      totalValue,
      currentMonth: {
        contacts: currentMonthContacts,
        deals: currentMonthDeals,
        value: currentMonthValue,
      },
      previousMonth: {
        contacts: previousMonthContacts,
        deals: previousMonthDeals,
        value: previousMonthValue,
      },
      trends: {
        contacts: contactsTrend,
        deals: dealsTrend,
        value: valueTrend,
      },
      monthlyTrends: monthlyTrendsData,
      // Statistiques par pipeline/stage
      pipeline: await this.getPipelineStats(userId),
    };
  }

  private calculateTrend(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0; // Si le mois précédent était 0, considérer une augmentation de 100% ou 0%
    }
    return Math.round(((current - previous) / previous) * 100);
  }

  private async getMonthlyTrendsData(userId: string, months = 6): Promise<any[]> {
    const today = new Date();
    const result = [];

    for (let i = 0; i < months; i++) {
      const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = i === 0 
        ? today 
        : new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      
      // Récupérer les deals gagnés pour ce mois (basé sur expectedCloseDate)
      const wonDeals = await this.dealRepository.find({
        where: {
          userId,
          status: 'won',
          expectedCloseDate: Between(monthStart, monthEnd),
        },
      });

      // Récupérer les contacts et deals créés ce mois-ci
      const contacts = await this.contactRepository.count({
        where: {
          userId,
          createdAt: Between(monthStart, monthEnd),
        },
      });

      const deals = await this.dealRepository.count({
        where: {
          userId,
          createdAt: Between(monthStart, monthEnd),
        },
      });

      const monthValue = wonDeals.reduce((sum, deal) => sum + Number(deal.value), 0);

      result.unshift({
        month: monthStart.toLocaleString('fr-FR', { month: 'short' }),
        year: monthStart.getFullYear(),
        contacts,
        deals,
        value: monthValue,
      });
    }

    return result;
  }

  async getPipelineStats(userId: string): Promise<any> {
    // Récupérer tous les pipelines de l'utilisateur
    const deals = await this.dealRepository.find({ 
      where: { userId },
      relations: ['pipeline']
    });

    // Organiser les statistiques par pipeline et par stage
    const pipelineStats = {};

    // Traiter chaque deal
    for (const deal of deals) {
      const pipelineId = deal.pipelineId;
      const stageId = deal.stageId;
      
      // Initialiser les stats pour ce pipeline si elles n'existent pas encore
      if (!pipelineStats[pipelineId]) {
        pipelineStats[pipelineId] = {
          id: pipelineId,
          name: deal.pipeline?.name || 'Pipeline sans nom',
          totalValue: 0,
          wonValue: 0,
          lostValue: 0,
          activeValue: 0,
          dealCount: 0,
          stages: {}
        };
      }

      // Initialiser les stats pour ce stage si elles n'existent pas encore
      if (!pipelineStats[pipelineId].stages[stageId]) {
        pipelineStats[pipelineId].stages[stageId] = {
          id: stageId,
          name: deal.stage?.name || 'Stage sans nom',
          count: 0,
          value: 0,
          deals: []
        };
      }
      
      // Ajouter le deal aux statistiques du stage
      pipelineStats[pipelineId].stages[stageId].count++;
      pipelineStats[pipelineId].stages[stageId].value += Number(deal.value) || 0;
      pipelineStats[pipelineId].stages[stageId].deals.push(deal);
      
      // Mettre à jour les totaux du pipeline
      pipelineStats[pipelineId].dealCount++;
      
      // Mettre à jour les totaux par statut
      if (deal.status === 'won') {
        pipelineStats[pipelineId].wonValue += Number(deal.value) || 0;
      } else if (deal.status === 'lost') {
        pipelineStats[pipelineId].lostValue += Number(deal.value) || 0;
      } else {
        pipelineStats[pipelineId].activeValue += Number(deal.value) || 0;
      }
      
      pipelineStats[pipelineId].totalValue += Number(deal.value) || 0;
    }

    return Object.values(pipelineStats);
  }
}