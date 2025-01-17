// src/modules/notion/types/notion.types.ts
export interface NotionWorkspace {
    id: string;
    name: string;
  }
  
  export interface NotionDatabase {
    id: string;
    title: string;
    properties: Record<string, any>;
  }
  
  export interface NotionPage {
    id: string;
    properties: Record<string, any>;
  }