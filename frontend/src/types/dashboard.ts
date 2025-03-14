// src/types/dashboard.ts
export interface NotionMetadata {
    pageId?: string;
    databaseId?: string;
    lastSync?: Date;
  }
  
  export interface Deal {
    id: string;
    name: string;
    value: number;
    status: 'active' | 'won' | 'lost';
    stageId: string;
    expectedCloseDate?: Date;
    pipelineId: string;
    userId: string;
    pipeline?: Pipeline;
    stage?: { name: string };
    customFields?: Record<string, any>;
    notionMetadata?: NotionMetadata;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Pipeline {
    id: string;
    name: string;
    stages: {
      id: string;
      name: string;
      count?: number;
      value?: number;
    }[];
  }
  
  export interface MonthlyTrend {
    month: string;
    year: number;
    contacts: number;
    deals: number;
    value: number;
  }
  
  export interface Trends {
    contacts: number;
    deals: number;
    value: number;
  }
  
  export interface PeriodStats {
    contacts: number;
    deals: number;
    value: number;
  }
  
  export interface DashboardStats {
    totalContacts: number;
    totalDeals: number;
    totalValue: number;
    currentMonth: PeriodStats;
    previousMonth: PeriodStats;
    trends: Trends;
    monthlyTrends: MonthlyTrend[];
    pipeline?: Pipeline[];
  }