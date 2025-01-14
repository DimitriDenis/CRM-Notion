// src/modules/auth/strategies/jwt.strategy.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { UserPlan } from '../../users/user.entity';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'test-secret'),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should validate a valid user', async () => {
    const testUser = {
      id: 'test-id',
      email: 'test@example.com',
      isActive: true,
      plan: UserPlan.FREE,
    };

    jest.spyOn(usersService, 'findOne').mockResolvedValue(testUser as any);

    const result = await strategy.validate({ sub: 'test-id' });
    expect(result).toEqual(testUser);
  });

  it('should throw UnauthorizedException for invalid user', async () => {
    jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

    await expect(strategy.validate({ sub: 'invalid-id' }))
      .rejects
      .toThrow(UnauthorizedException);
  });
});