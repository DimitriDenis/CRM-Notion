// src/modules/notion/notion-setup.controller.ts
import { Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { NotionService } from './notion.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/decorators/user.decorator';
import { User as UserEntity } from '../users/user.entity';

@Controller('auth/notion')
export class NotionSetupController {
  constructor(
    @Inject(NotionService)
    private readonly notionService: NotionService
  ) {}

  @Get('permissions')
  async checkPermissions(@User() user: UserEntity) {
    const result = await this.notionService.verifyAccessToken(user.notionAccessToken);
    return {
      hasRequiredPermissions: result,
      permissions: {
        readContent: result,
        updateContent: result,
        insertContent: result,
      }
    };
  }

  @Post('setup')
  async setupDatabases(@User() user: UserEntity) {
    return this.notionService.setupInitialDatabases(
      user.notionAccessToken,
      user.notionWorkspaceId
    );
  }
}