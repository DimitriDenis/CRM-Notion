// src/modules/test/dto/create-test-user.dto.ts
export class CreateTestUserDto {
    email: string;
    name: string;
    notionUserId: string;
    notionAccessToken: string;
    notionWorkspaceId: string;
    isActive: boolean;
  }