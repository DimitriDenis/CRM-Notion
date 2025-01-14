// src/modules/contacts/dto/contact.response.dto.ts
export class ContactResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    notes?: string;
    tags: { id: string; name: string; color: string }[];
    customFields?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }