// src/modules/contacts/contacts.controller.ts
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    HttpStatus,
    ParseUUIDPipe,
  } from '@nestjs/common';
  import { ContactsService } from './contacts.service';
  import { Auth } from '../auth/decorators/auth.decorator';
  import { CurrentUser } from '../../decorators/current-user.decorator';
  import { User } from '../users/user.entity';
  import { CreateContactDto } from './dto/create-contact.dto';
  import { UpdateContactDto } from './dto/update-contact.dto';
  import { FindContactsDto } from './dto/find-contacts.dto';
  import { ContactResponseDto } from './dto/contact.response.dto';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
  
  @ApiTags('Contacts')
  @Controller('contacts')
  @Auth()
  export class ContactsController {
    constructor(private readonly contactsService: ContactsService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new contact' })
    @ApiResponse({ status: HttpStatus.CREATED, type: ContactResponseDto })
    async create(
      @CurrentUser() user: User,
      @Body() createContactDto: CreateContactDto,
    ) {
      return this.contactsService.create(user.id, createContactDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all contacts' })
    @ApiResponse({ status: HttpStatus.OK, type: [ContactResponseDto] })
    async findAll(
      @CurrentUser() user: User,
      @Query() query: FindContactsDto,
    ) {
      const { items, total } = await this.contactsService.findAll(user.id, query);
      
      return {
        items,
        total,
        skip: query.skip,
        take: query.take,
      };
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a contact by ID' })
    @ApiResponse({ status: HttpStatus.OK, type: ContactResponseDto })
    async findOne(
      @CurrentUser() user: User,
      @Param('id', ParseUUIDPipe) id: string,
    ) {
      return this.contactsService.findOne(user.id, id);
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Update a contact' })
    @ApiResponse({ status: HttpStatus.OK, type: ContactResponseDto })
    async update(
      @CurrentUser() user: User,
      @Param('id', ParseUUIDPipe) id: string,
      @Body() updateContactDto: UpdateContactDto,
    ) {
      return this.contactsService.update(user.id, id, updateContactDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a contact' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async remove(
      @CurrentUser() user: User,
      @Param('id', ParseUUIDPipe) id: string,
    ) {
      await this.contactsService.remove(user.id, id);
    }
  
    @Get('count/total')
    @ApiOperation({ summary: 'Get total number of contacts' })
    @ApiResponse({ status: HttpStatus.OK, type: Number })
    async getCount(@CurrentUser() user: User) {
      const count = await this.contactsService.countByUser(user.id);
      return { count };
    }
  }