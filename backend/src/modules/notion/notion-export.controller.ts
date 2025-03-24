// src/modules/notion/notion-export.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotionExportService } from './notion-export.service';
import { User } from '../auth/decorators/user.decorator';

@Controller('api/export')
@UseGuards(JwtAuthGuard)
export class NotionExportController {
  constructor(private notionExportService: NotionExportService) {}

  @Post('notion')
  async exportToNotion(
    @User() user,
    @Body() body: {
      entities: ('contacts' | 'deals' | 'pipelines' | 'tags')[],
      ids?: Record<string, string[]>,
      workspaceId?: string
    }
  ) {
    try {
      const result = await this.notionExportService.exportToNotion(
        user.id,
        body
      );
      
      return {
        success: true,
        message: 'Exportation réussie',
        data: result
      };
    } catch (error) {
      console.error('Export error:', error);
      return {
        success: false,
        message: error.message || 'Échec de l exportation',
        error: error.response || error.toString()
      };
    }
  }
}