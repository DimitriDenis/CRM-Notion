// src/modules/test/test.controller.ts
import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { TestService } from './test.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Test')
@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post('users')
  async createTestUser(
    @Headers('X-Test-Secret') testSecret: string,
    @Body() createTestUserDto: any,
  ) {
    if (process.env.NODE_ENV === 'production') {
      throw new UnauthorizedException('Test endpoints are not available in production');
    }
    
    if (testSecret !== process.env.TEST_SECRET_KEY) {
      throw new UnauthorizedException('Invalid test secret key');
    }

    return this.testService.createTestUser(createTestUserDto);
  }
}