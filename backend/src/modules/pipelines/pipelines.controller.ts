// src/modules/pipelines/pipelines.controller.ts
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
    ParseIntPipe,
    UseGuards,
  } from '@nestjs/common';
  import { PipelinesService } from './pipelines.service';
  import { Auth } from '../auth/decorators/auth.decorator';
  import { CurrentUser } from '../../decorators/current-user.decorator';
  import { User } from '../users/user.entity';
  import { CreatePipelineDto } from './dto/create-pipeline.dto';
  import { UpdatePipelineDto } from './dto/update-pipeline.dto';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  
  @ApiTags('Pipelines')
  @Controller('pipelines')
  @Auth()
  @UseGuards(JwtAuthGuard)
  export class PipelinesController {
    constructor(private readonly pipelinesService: PipelinesService) {}


    @Get('overview')
async getPipelineOverview(@CurrentUser() user: User) {
  try {
    const pipelineOverview = await this.pipelinesService.getPipelineOverview(user.id);
    
    // Si aucun pipeline n'est trouvé, renvoyer un objet par défaut
    return pipelineOverview || { 
      stages: [], 
      deals: [] 
    };
  } catch (error) {
    console.error('Error fetching pipeline overview:', error);
    // En cas d'erreur, toujours renvoyer un objet par défaut
    return { 
      stages: [], 
      deals: [] 
    };
  }
}
  
    @Post()
    @ApiOperation({ summary: 'Create a new pipeline' })
    async create(
      @CurrentUser() user: User,
      @Body() createPipelineDto: CreatePipelineDto,
    ) {
      return this.pipelinesService.create(user.id, createPipelineDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all pipelines' })
    async findAll(
      @CurrentUser() user: User,
      @Query('skip', new ParseIntPipe({ optional: true })) skip?: number,
      @Query('take', new ParseIntPipe({ optional: true })) take?: number,
    ) {
      return this.pipelinesService.findAll(user.id, { skip, take });
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a pipeline by ID' })
    async findOne(
      @CurrentUser() user: User,
      @Param('id', ParseUUIDPipe) id: string,
    ) {
      return this.pipelinesService.findOne(user.id, id);
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Update a pipeline' })
    async update(
      @CurrentUser() user: User,
      @Param('id', ParseUUIDPipe) id: string,
      @Body() updatePipelineDto: UpdatePipelineDto,
    ) {
      return this.pipelinesService.update(user.id, id, updatePipelineDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a pipeline' })
    async remove(
      @CurrentUser() user: User,
      @Param('id', ParseUUIDPipe) id: string,
    ) {
      await this.pipelinesService.remove(user.id, id);
    }

    @Get(':id/stats')
@ApiOperation({ summary: 'Get pipeline statistics' })
async getPipelineStats(
  @CurrentUser() user: User,
  @Param('id', ParseUUIDPipe) id: string,
) {
  const pipeline = await this.pipelinesService.findOne(user.id, id);
  
  if (!pipeline) {
    return { 
      id,
      name: '',
      stages: [],
      totalDeals: 0,
      totalValue: 0
    };
  }
  
  // Vous devrez implémenter cette méthode dans votre service
  return this.pipelinesService.getPipelineStats(user.id, id);
}

@Get(':id/deals')
@ApiOperation({ summary: 'Get deals for a specific pipeline' })
async getPipelineDeals(
  @CurrentUser() user: User,
  @Param('id', ParseUUIDPipe) id: string,
) {
  // Vérifiez d'abord si le pipeline existe et appartient à l'utilisateur
  const pipeline = await this.pipelinesService.findOne(user.id, id);
  
  if (!pipeline) {
    return { items: [], total: 0 };
  }
  
  // Récupérez les deals pour ce pipeline
  // Vous devrez implémenter cette méthode dans votre service
  return this.pipelinesService.getDealsForPipeline(user.id, id);
}
  
    @Get('count/total')
    @ApiOperation({ summary: 'Get total number of pipelines' })
    async getCount(@CurrentUser() user: User) {
      const count = await this.pipelinesService.countByUser(user.id);
      return { count };
    }

    
  }