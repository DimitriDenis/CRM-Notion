// src/modules/test/test.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateTestUserDto } from './dto/create-test-user.dto';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createTestUser(createTestUserDto: CreateTestUserDto) {
    const user = this.userRepository.create(createTestUserDto);
    await this.userRepository.save(user);

    const testAuthToken = this.jwtService.sign({ sub: user.id });

    return {
      ...user,
      testAuthToken,
    };
  }
}