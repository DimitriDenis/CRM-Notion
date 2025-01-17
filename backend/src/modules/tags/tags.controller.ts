// src/modules/tags/tags.controller.ts
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
  } from '@nestjs/common';
  import { TagsService } from './tags.service';
  import { Auth } from '../auth/decorators/auth.decorator';
  import { CurrentUser } from '../../decorators/current-user.decorator';
  import { User } from '../users/user.entity';
  import { CreateTagDto } from './dto/create-tag.dto';
  import { UpdateTagDto } from './dto/update-tag.dto';
  import { FindTagsDto } from './dto/find-tags.dto';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
  
  @ApiTags('Tags')
  @Controller('tags')
  @Auth()
  export class TagsController {
    constructor(private readonly tagsService: TagsService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new tag' })
    async create(
      @CurrentUser() user: User,
      @Body() createTagDto: CreateTagDto,
    ) {
      return this.tagsService.create(user.id, createTagDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all tags' })
    async findAll(
      @CurrentUser() user: User,
      @Query() query: FindTagsDto,
    ) {
      return this.tagsService.findAll(user.id, query);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a tag by ID' })
    async findOne(
      @CurrentUser() user: User,
      @Param('id', ParseUUIDPipe) id: string,
    ) {
      return this.tagsService.findOne(user.id, id);
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Update a tag' })
    async update(
      @CurrentUser() user: User,
      @Param('id', ParseUUIDPipe) id: string,
      @Body() updateTagDto: UpdateTagDto,
    ) {
      return this.tagsService.update(user.id, id, updateTagDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a tag' })
    async remove(
      @CurrentUser() user: User,
      @Param('id', ParseUUIDPipe) id: string,
    ) {
      await this.tagsService.remove(user.id, id);
    }
  }