// src/types/dashboard.ts
export interface DashboardStats {
    totalContacts: number;
    totalDeals: number;
    totalValue: number;
  }
  
  export interface Deal {
    id: string;
    name: string;
    value: number;
    stage: {
        id: string;
        name: string;
      };
    updatedAt: string;
  }
  
  export interface Pipeline {
    id: string;
    name: string;
    stages: Array<{
      name: string;
      count: number;
      value: number;
    }>;
  }