"use client";

/**
 * AI質問モーダルコンポーネント
 *
 * 選択されたブックマークのURLの内容についてAIに質問できる機能を提供します。
 * URLの内容を取得し、OpenAI APIを使用して質問に回答します。
 */

import React, { useState } from "react";
import { MessageSquare, Send, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bookmark as BookmarkType } from "@prisma/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * AiQuestionModalコンポーネントのプロパティ
 */
interface AiQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmark: BookmarkType | null;
}

export const AiQuestionModal: React.FC<AiQuestionModalProps> = ({
  isOpen,
  onClose,
  bookmark,
}) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * 質問を送信してAIの回答を取得
   */
  const handleSubmit = async () => {
    if (!bookmark || !question.trim()) return;

    setIsLoading(true);
    setError("");
    setAnswer("");

    try {
      const response = await fetch("/api/ai/analyze-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: bookmark.url,
          question: question.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "エラーが発生しました");
      }

      setAnswer(data.answer);
    } catch (error) {
      console.error("AI question error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "エラーが発生しました。もう一度お試しください。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * モーダルを閉じる際のクリーンアップ
   */
  const handleClose = () => {
    setQuestion("");
    setAnswer("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="rounded-2xl border border-amber-200 max-w-2xl max-h-[90vh] flex flex-col">
        {/* ヘッダー */}
        <DialogHeader className="border-b border-amber-100 pb-4 bg-gradient-to-r from-amber-50 to-orange-50 -m-6 p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              AIに質問する
            </DialogTitle>
          </div>
          {bookmark && (
            <p className="text-sm text-gray-600 mt-2">
              {bookmark.url}の内容について質問できます
            </p>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 mt-6">
          {/* 質問入力エリア */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              質問
            </label>
            <Textarea
              value={question}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value)}
              placeholder="このページについて質問を入力してください..."
              rows={3}
              className="border-amber-200 focus:ring-amber-500 focus:border-amber-500 rounded-xl resize-none"
              disabled={isLoading}
            />
          </div>

          {/* エラー表示 */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* 回答表示エリア */}
          {answer && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                AIの回答
              </label>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
              </div>
            </div>
          )}

          {/* ローディング表示 */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
              <span className="ml-3 text-gray-600">回答を生成中...</span>
            </div>
          )}
        </div>

        {/* フッターボタン */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-amber-100">
          <Button variant="outline" onClick={handleClose} className="rounded-xl">
            閉じる
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!question.trim() || isLoading}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-80 text-white rounded-xl shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                処理中...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                質問する
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};