// src/modules/auth/strategies/notion.strategy.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotionStrategy } from './notion.strategy';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

global.fetch = jest.fn(); // Mock fetch pour les appels API

describe('NotionStrategy', () => {
  let strategy: NotionStrategy;
  let authService: AuthService;

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
      ],
    }).compile();

    strategy = module.get<NotionStrategy>(NotionStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate Notion user', async () => {
      const mockNotionResponse = {
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

      // Mock de l'appel fetch
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockNotionResponse),
      });

      jest.spyOn(authService, 'validateNotionUser').mockResolvedValue(mockUser as any);

      const result = await strategy.validate('test-token', 'refresh-token', {});

      expect(result).toEqual(mockUser);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.notion.com/v1/users/me',
        expect.any(Object)
      );
      expect(authService.validateNotionUser).toHaveBeenCalledWith({
        id: mockNotionResponse.bot_id,
        email: mockNotionResponse.owner.user.email,
        name: mockNotionResponse.owner.user.name,
        accessToken: 'test-token',
        workspaceId: mockNotionResponse.workspace_id,
      });
    });

    it('should handle API errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      await expect(strategy.validate('invalid-token', 'refresh-token', {}))
        .rejects
        .toThrow('Failed to fetch Notion user info');
    });
  });
});