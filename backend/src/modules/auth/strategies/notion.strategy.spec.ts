// src/modules/auth/strategies/notion.strategy.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotionStrategy } from './notion.strategy';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { NotionService } from '../../notion/notion.service';

jest.mock('passport-oauth2');

describe('NotionStrategy', () => {
  let strategy: NotionStrategy;
  let authService: AuthService;
  let notionService: NotionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotionStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              const config = {
                'NOTION_OAUTH_CLIENT_ID': 'test-client-id',
                'NOTION_OAUTH_CLIENT_SECRET': 'test-client-secret',
                'NOTION_OAUTH_REDIRECT_URI': 'http://localhost:3000/callback',
              };
              return config[key];
            }),
          },
        },
        {
          provide: AuthService,
          useValue: {
            validateNotionUser: jest.fn(),
          },
        },
        {
          provide: NotionService,
          useValue: {
            getUserInfo: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<NotionStrategy>(NotionStrategy);
    authService = module.get<AuthService>(AuthService);
    notionService = module.get<NotionService>(NotionService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate Notion user', async () => {
      const mockNotionUser = {
        bot_id: 'test-bot-id',
        owner: {
          user: {
            email: 'test@example.com',
            name: 'Test User',
          },
        },
        workspace_id: 'test-workspace',
      };

      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
      };

      jest.spyOn(notionService, 'getUserInfo').mockResolvedValue(mockNotionUser);
      jest.spyOn(authService, 'validateNotionUser').mockResolvedValue(mockUser as any);

      const result = await strategy.validate('test-token', 'refresh-token', {});

      expect(result).toEqual(mockUser);
      expect(notionService.getUserInfo).toHaveBeenCalledWith('test-token');
    });
  });
});