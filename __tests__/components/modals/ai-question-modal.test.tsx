import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AiQuestionModal } from '@/components/modals/ai-question-modal';
import { Bookmark as BookmarkType } from '@prisma/client';

// fetchのモック
global.fetch = jest.fn();

const mockBookmark: BookmarkType = {
  id: '1',
  topicId: '1',
  url: 'https://example.com',
  description: 'テストブックマーク',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockProps = {
  isOpen: true,
  onClose: jest.fn(),
  bookmark: mockBookmark,
};

describe('AiQuestionModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('基本的な表示', () => {
    it('モーダルが正しく表示されるべき', () => {
      render(<AiQuestionModal {...mockProps} />);
      
      expect(screen.getByText('AIに質問する')).toBeTruthy();
      expect(screen.getByText(/example.com/)).toBeTruthy();
      expect(screen.getByPlaceholderText('このページについて質問を入力してください...')).toBeTruthy();
    });

    it('ブックマークがnullの場合でもクラッシュしないべき', () => {
      render(<AiQuestionModal {...mockProps} bookmark={null} />);
      
      expect(screen.getByText('AIに質問する')).toBeTruthy();
    });

    it('閉じるボタンがクリックできるべき', () => {
      render(<AiQuestionModal {...mockProps} />);
      
      const closeButton = screen.getByText('閉じる');
      fireEvent.click(closeButton);
      
      expect(mockProps.onClose).toHaveBeenCalled();
    });
  });

  describe('質問機能', () => {
    it('質問を入力できるべき', () => {
      render(<AiQuestionModal {...mockProps} />);
      
      const textarea = screen.getByPlaceholderText('このページについて質問を入力してください...');
      fireEvent.change(textarea, { target: { value: 'このページの主な内容は何ですか？' } });
      
      expect(textarea).toHaveValue('このページの主な内容は何ですか？');
    });

    it('空の質問では送信ボタンが無効になるべき', () => {
      render(<AiQuestionModal {...mockProps} />);
      
      const submitButton = screen.getByText('質問する');
      expect(submitButton.hasAttribute('disabled')).toBe(true);
    });

    it('質問入力後、送信ボタンが有効になるべき', () => {
      render(<AiQuestionModal {...mockProps} />);
      
      const textarea = screen.getByPlaceholderText('このページについて質問を入力してください...');
      fireEvent.change(textarea, { target: { value: '質問内容' } });
      
      const submitButton = screen.getByText('質問する');
      expect(submitButton.hasAttribute('disabled')).toBe(false);
    });
  });

  describe('API通信', () => {
    it('質問送信時にAPIが呼ばれるべき', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          answer: 'AIの回答です',
          urlContent: 'URLの内容...',
        }),
      });

      render(<AiQuestionModal {...mockProps} />);
      
      const textarea = screen.getByPlaceholderText('このページについて質問を入力してください...');
      fireEvent.change(textarea, { target: { value: '質問内容' } });
      
      const submitButton = screen.getByText('質問する');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/ai/analyze-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: 'https://example.com',
            question: '質問内容',
          }),
        });
      });
    });

    it('成功時に回答が表示されるべき', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          answer: 'これはAIの回答です',
          urlContent: 'URLの内容...',
        }),
      });

      render(<AiQuestionModal {...mockProps} />);
      
      const textarea = screen.getByPlaceholderText('このページについて質問を入力してください...');
      fireEvent.change(textarea, { target: { value: '質問内容' } });
      
      const submitButton = screen.getByText('質問する');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('これはAIの回答です')).toBeTruthy();
      });
    });

    it('エラー時にエラーメッセージが表示されるべき', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: 'APIキーが設定されていません',
        }),
      });

      render(<AiQuestionModal {...mockProps} />);
      
      const textarea = screen.getByPlaceholderText('このページについて質問を入力してください...');
      fireEvent.change(textarea, { target: { value: '質問内容' } });
      
      const submitButton = screen.getByText('質問する');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('APIキーが設定されていません')).toBeTruthy();
      });
    });

    it('ネットワークエラー時に一般的なエラーメッセージが表示されるべき', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<AiQuestionModal {...mockProps} />);
      
      const textarea = screen.getByPlaceholderText('このページについて質問を入力してください...');
      fireEvent.change(textarea, { target: { value: '質問内容' } });
      
      const submitButton = screen.getByText('質問する');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeTruthy();
      });
    });
  });

  describe('ローディング状態', () => {
    it('送信中はローディング状態が表示されるべき', async () => {
      (fetch as jest.Mock).mockImplementation(() => 
        new Promise((resolve) => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ answer: '回答', urlContent: '内容' }),
        }), 100))
      );

      render(<AiQuestionModal {...mockProps} />);
      
      const textarea = screen.getByPlaceholderText('このページについて質問を入力してください...');
      fireEvent.change(textarea, { target: { value: '質問内容' } });
      
      const submitButton = screen.getByText('質問する');
      fireEvent.click(submitButton);

      expect(screen.getByText('回答を生成中...')).toBeTruthy();
      expect(screen.getByText('処理中...')).toBeTruthy();
    });

    it('ローディング中は入力が無効になるべき', async () => {
      (fetch as jest.Mock).mockImplementation(() => 
        new Promise((resolve) => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ answer: '回答', urlContent: '内容' }),
        }), 100))
      );

      render(<AiQuestionModal {...mockProps} />);
      
      const textarea = screen.getByPlaceholderText('このページについて質問を入力してください...') as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: '質問内容' } });
      
      const submitButton = screen.getByText('質問する');
      fireEvent.click(submitButton);

      expect(textarea.disabled).toBe(true);
    });
  });

  describe('モーダル閉じる動作', () => {
    it('閉じる時に状態がリセットされるべき', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          answer: 'AIの回答',
          urlContent: 'URLの内容...',
        }),
      });

      const { rerender } = render(<AiQuestionModal {...mockProps} />);
      
      // 質問と回答を生成
      const textarea = screen.getByPlaceholderText('このページについて質問を入力してください...');
      fireEvent.change(textarea, { target: { value: '質問内容' } });
      
      const submitButton = screen.getByText('質問する');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('AIの回答')).toBeTruthy();
      });

      // モーダルを閉じて再度開く
      rerender(<AiQuestionModal {...mockProps} isOpen={false} />);
      rerender(<AiQuestionModal {...mockProps} isOpen={true} />);

      // 状態がリセットされているか確認
      const newTextarea = screen.getByPlaceholderText('このページについて質問を入力してください...') as HTMLTextAreaElement;
      expect(newTextarea.value).toBe('');
      expect(screen.queryByText('AIの回答')).toBeNull();
    });
  });
});