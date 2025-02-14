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
  
  export interface DashboardStats {
    totalContacts: number;
    totalDeals: number;
    totalValue: number;
    trends: {
      contacts: number;
      deals: number;
      value: number;
    };
  }