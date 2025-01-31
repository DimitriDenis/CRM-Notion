// src/modules/stats/stats.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StatsService } from './stats.service';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('dashboard')
  async getDashboardStats(@CurrentUser() user: User) {
    return this.statsService.getDashboardStats(user.id);
  }
}