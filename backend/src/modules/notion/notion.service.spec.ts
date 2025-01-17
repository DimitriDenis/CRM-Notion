// src/modules/notion/notion.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NotionService } from './notion.service';
import { Logger } from '@nestjs/common';
import { NOTION_API_VERSION } from './constants/database-schemas';

describe('NotionService', () => {
  let service: NotionService;
  let configService: ConfigService;
  let mockFetch: jest.Mock;

  const mockAccessToken = 'test-access-token';
  const mockWorkspaceId = 'test-workspace-id';
  const mockDatabaseId = 'test-database-id';
  const mockPageId = 'test-page-id';

  beforeEach(async () => {
    // Mock fetch global
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotionService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotionService>(NotionService);
    configService = module.get<ConfigService>(ConfigService);

    // Spy sur le Logger
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserInfo', () => {
    it('should fetch user info successfully', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ id: 'user-id', name: 'Test User' }),
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await service.getUserInfo(mockAccessToken);

      expect(mockFetch).toHaveBeenCalledWith('https://api.notion.com/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${mockAccessToken}`,
          'Notion-Version': NOTION_API_VERSION,
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual({ id: 'user-id', name: 'Test User' });
    });

    it('should handle error response', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      await expect(service.getUserInfo(mockAccessToken)).rejects.toThrow();
    });
  });

  describe('createDatabase', () => {
    it('should create database successfully', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ id: 'database-id' }),
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      const title = 'Test Database';
      const schema = { Name: { title: {} } };

      const result = await service.createDatabase(mockAccessToken, mockWorkspaceId, title, schema);

      expect(mockFetch).toHaveBeenCalledWith('https://api.notion.com/v1/databases', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mockAccessToken}`,
          'Notion-Version': NOTION_API_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parent: { page_id: mockWorkspaceId },
          title: [{ text: { content: title } }],
          properties: schema,
        }),
      });
      expect(result).toEqual({ id: 'database-id' });
    });
  });

  describe('queryDatabase', () => {
    it('should query database successfully', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      const filter = { property: 'Name', equals: 'Test' };

      const result = await service.queryDatabase(mockAccessToken, mockDatabaseId, filter);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.notion.com/v1/databases/${mockDatabaseId}/query`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mockAccessToken}`,
            'Notion-Version': NOTION_API_VERSION,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filter }),
        },
      );
      expect(result).toEqual({ results: [] });
    });
  });

  describe('updatePage', () => {
    it('should update page successfully', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ id: mockPageId }),
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      const properties = { Name: { title: [{ text: { content: 'Updated Name' } }] } };

      const result = await service.updatePage(mockAccessToken, mockPageId, properties);

      expect(mockFetch).toHaveBeenCalledWith(`https://api.notion.com/v1/pages/${mockPageId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${mockAccessToken}`,
          'Notion-Version': NOTION_API_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      });
      expect(result).toEqual({ id: mockPageId });
    });
  });

  describe('searchWorkspaces', () => {
    it('should search workspaces successfully', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ results: [{ id: 'workspace-id' }] }),
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await service.searchWorkspaces(mockAccessToken);

      expect(mockFetch).toHaveBeenCalledWith('https://api.notion.com/v1/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mockAccessToken}`,
          'Notion-Version': NOTION_API_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            property: 'object',
            value: 'workspace',
          },
        }),
      });
      expect(result).toEqual({ results: [{ id: 'workspace-id' }] });
    });
  });

  describe('verifyAccessToken', () => {
    it('should return true for valid token', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ id: 'user-id' }),
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await service.verifyAccessToken(mockAccessToken);

      expect(result).toBe(true);
    });

    it('should return false for invalid token', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await service.verifyAccessToken(mockAccessToken);

      expect(result).toBe(false);
    });
  });
});