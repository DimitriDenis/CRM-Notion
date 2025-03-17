// src/modules/deals/deals.controller.ts
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    ParseUUIDPipe,
    UseGuards,
    BadRequestException,
    UsePipes,
    ValidationPipe,
    UnauthorizedException,
  } from '@nestjs/common';
  import { DealsService } from './deals.service';
  import { Auth } from '../auth/decorators/auth.decorator';
  import { CurrentUser } from '../../decorators/current-user.decorator';
  import { User } from '../users/user.entity';
  import { CreateDealDto } from './dto/create-deal.dto';
  import { UpdateDealDto } from './dto/update-deal.dto';
  import { FindDealsDto } from './dto/find-deals.dto';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetRecentDealsDto } from './dto/get-recent-deals.dto';
  
  @ApiTags('Deals')
  @Controller('deals')
  @Auth()
  @UseGuards(JwtAuthGuard)
  export class DealsController {
    constructor(private readonly dealsService: DealsService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new deal' })
    async create(
      @CurrentUser() user: User,
      @Body() createDealDto: CreateDealDto,
    ) {
      return this.dealsService.create(user.id, createDealDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all deals' })
    async findAll(
      @CurrentUser() user: User,
      @Query() query: FindDealsDto,
    ) {
      return this.dealsService.findAll(user.id, query);
    }

    @Get('recent')     
@UseGuards(JwtAuthGuard) 
async getRecentDeals(@CurrentUser() user: User) {   
  console.log('=== getRecentDeals DEBUG ===');   
  console.log('Entering getRecentDeals endpoint');
  console.log('Request received');
  console.log('User object:', JSON.stringify(user, null, 2));   
  
  try {
    return this.dealsService.getRecentDeals(user.id); 
  } catch (error) {
    console.error('Error in getRecentDeals:', error);
    throw error;
  }
}
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a deal by ID' })
    async findOne(
      @CurrentUser() user: User,
      @Param('id', ParseUUIDPipe) id: string,
    ) {
      return this.dealsService.findOne(user.id, id);
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Update a deal' })
    async update(
      @CurrentUser() user: User,
      @Param('id', ParseUUIDPipe) id: string,
      @Body() updateDealDto: UpdateDealDto,
    ) {
      return this.dealsService.update(user.id, id, updateDealDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a deal' })
    async remove(
      @CurrentUser() user: User,
      @Param('id', ParseUUIDPipe) id: string,
    ) {
      await this.dealsService.remove(user.id, id);
    }
  
    @Get('stats/total-value')
    @ApiOperation({ summary: 'Get total value of all deals' })
    async getTotalValue(@CurrentUser() user: User) {
      const total = await this.dealsService.getTotalValue(user.id);
      return { total };
    }

    
  }