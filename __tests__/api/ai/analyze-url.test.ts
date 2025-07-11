import { NextRequest } from 'next/server';
import { POST } from '@/app/api/ai/analyze-url/route';

// モジュールのモック
jest.mock('openai', () => ({
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  })),
}));

jest.mock('cheerio', () => ({
  load: jest.fn(() => {
    const $ = (selector: string) => ({
      remove: jest.fn().mockReturnThis(),
      first: jest.fn().mockReturnThis(),
      text: jest.fn(() => 'Mock page content for testing'),
    });
    return $;
  }),
}));

// fetchのモック
global.fetch = jest.fn();

// 環境変数のモック
const originalEnv = process.env;

describe('/api/ai/analyze-url', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, OPENAI_API_KEY: 'test-api-key' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('バリデーション', () => {
    it('URLが未指定の場合は400エラーを返すべき', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/analyze-url', {
        method: 'POST',
        body: JSON.stringify({ question: '質問' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('URLと質問は必須です');
    });

    it('質問が未指定の場合は400エラーを返すべき', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/analyze-url', {
        method: 'POST',
        body: JSON.stringify({ url: 'https://example.com' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('URLと質問は必須です');
    });

    it('OpenAI APIキーが未設定の場合は500エラーを返すべき', async () => {
      delete process.env.OPENAI_API_KEY;

      const request = new NextRequest('http://localhost:3000/api/ai/analyze-url', {
        method: 'POST',
        body: JSON.stringify({
          url: 'https://example.com',
          question: '質問',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('OpenAI APIキーが設定されていません');
    });
  });

  describe('URL内容の取得', () => {
    it('URLの内容を正しく取得できるべき', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => '<html><body>Test content</body></html>',
      });

      const OpenAI = require('openai').default;
      const mockCreate = jest.fn().mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: 'AIの回答です',
            },
          },
        ],
      });
      OpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      }));

      const request = new NextRequest('http://localhost:3000/api/ai/analyze-url', {
        method: 'POST',
        body: JSON.stringify({
          url: 'https://example.com',
          question: '質問',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(fetch).toHaveBeenCalledWith('https://example.com', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
    });

    it('URLの取得に失敗した場合はエラーを返すべき', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const request = new NextRequest('http://localhost:3000/api/ai/analyze-url', {
        method: 'POST',
        body: JSON.stringify({
          url: 'https://example.com',
          question: '質問',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('エラーが発生しました。もう一度お試しください。');
    });
  });

  describe('OpenAI API連携', () => {
    it('正常に回答を生成できるべき', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => '<html><body>Test content</body></html>',
      });

      const OpenAI = require('openai').default;
      const mockCreate = jest.fn().mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: 'これはAIの回答です',
            },
          },
        ],
      });
      OpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      }));

      const request = new NextRequest('http://localhost:3000/api/ai/analyze-url', {
        method: 'POST',
        body: JSON.stringify({
          url: 'https://example.com',
          question: 'このページの内容は何ですか？',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.answer).toBe('これはAIの回答です');
      expect(data.urlContent).toContain('Mock page content');
      
      // OpenAI APIが正しいパラメータで呼ばれたか確認
      expect(mockCreate).toHaveBeenCalledWith({
        model: 'gpt-3.5-turbo',
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'system',
            content: expect.stringContaining('日本語で回答'),
          }),
          expect.objectContaining({
            role: 'user',
            content: expect.stringContaining('このページの内容は何ですか？'),
          }),
        ]),
        temperature: 0.7,
        max_tokens: 1000,
      });
    });

    it('OpenAI APIエラー時は500エラーを返すべき', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => '<html><body>Test content</body></html>',
      });

      const OpenAI = require('openai').default;
      OpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: jest.fn().mockRejectedValueOnce(new Error('OpenAI API Error')),
          },
        },
      }));

      const request = new NextRequest('http://localhost:3000/api/ai/analyze-url', {
        method: 'POST',
        body: JSON.stringify({
          url: 'https://example.com',
          question: '質問',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('エラーが発生しました。もう一度お試しください。');
    });
  });
});