// src/modules/notion/constants/database-schemas.ts
export const NOTION_API_VERSION = '2022-06-28';

export const CONTACT_DATABASE_SCHEMA = {
  Name: {
    title: {},
  },
  Email: {
    email: {},
  },
  Phone: {
    phone_number: {},
  },
  Company: {
    rich_text: {},
  },
  Notes: {
    rich_text: {},
  },
  Tags: {
    multi_select: {
      options: [],
    },
  },
  Status: {
    select: {
      options: [
        { name: 'Active', color: 'green' },
        { name: 'Inactive', color: 'red' },
      ],
    },
  },
};

export const PIPELINE_DATABASE_SCHEMA = {
  Name: {
    title: {},
  },
  Stage: {
    select: {
      options: [],
    },
  },
  Value: {
    number: {
      format: 'dollar',
    },
  },
  Contacts: {
    relation: {
      database_id: '', // À remplir dynamiquement
    },
  },
  CloseDate: {
    date: {},
  },
};