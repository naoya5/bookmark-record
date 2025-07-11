"use client";

/**
 * ブックマーク管理メインコンポーネント
 *
 * トピックサイドバーとブックマークグリッドを統合し、
 * 全体的なブックマーク管理機能を提供します。
 * カスタムフックを使用して状態管理とモーダル制御を行います。
 */

import React from "react";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useTopics, TopicWithBookmarkCount } from "@/hooks/use-topics";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useModals } from "@/hooks/use-modal";
import { Bookmark as BookmarkType } from "@/lib/generated/prisma/client";
import { TopicSidebar } from "./topic-sidebar";
import { BookmarkGrid } from "./bookmark-grid";
import { TopicModal } from "./modals/topic-modal";
import { BookmarkModal } from "./modals/bookmark-modal";
import { AiQuestionModal } from "./modals/ai-question-modal";
import { ModeToggle } from "./ui/mode-toggle";
import { ColorThemeToggle } from "./ui/color-theme-toggle";


/**
 * BookmarkManagerClientコンポーネントのプロパティ
 */
interface BookmarkManagerClientProps {
  initialTopics: TopicWithBookmarkCount[];
}

export const BookmarkManagerClient: React.FC<BookmarkManagerClientProps> = ({
  initialTopics,
}) => {
  // カスタムフックによる状態管理
  const topicsHook = useTopics(initialTopics);
  const bookmarksHook = useBookmarks(
    topicsHook.selectedTopicId,
    topicsHook.mutateTopics
  );
  const modalsHook = useModals(topicsHook.selectedTopicId);

  // AI質問モーダルの状態管理
  const [showAiModal, setShowAiModal] = React.useState(false);
  const [selectedBookmark, setSelectedBookmark] = React.useState<BookmarkType | null>(null);

  /**
   * トピックモーダルの送信処理
   * 新規作成または編集を判定して適切な処理を実行
   */
  const handleTopicModalSubmit = async () => {
    const success = topicsHook.editingTopic
      ? await topicsHook.handleUpdateTopic()
      : await topicsHook.handleCreateTopic();

    if (success) {
      modalsHook.closeTopicModal();
    }
  };

  /**
   * ブックマークモーダルの送信処理
   * 新規作成または編集を判定して適切な処理を実行
   */
  const handleBookmarkModalSubmit = async () => {
    const success = bookmarksHook.editingBookmark
      ? await bookmarksHook.handleUpdateBookmark()
      : await bookmarksHook.handleCreateBookmark();

    if (success) {
      modalsHook.closeBookmarkModal();
    }
  };

  // トピック操作のハンドラー関数群
  const handleTopicCreate = () => {
    topicsHook.resetTopicForm();
    modalsHook.openTopicModal();
  };

  const handleTopicEdit = (topic: TopicWithBookmarkCount) => {
    topicsHook.openEditTopic(topic);
    modalsHook.openTopicModal();
  };

  // ブックマーク操作のハンドラー関数群
  const handleBookmarkCreate = () => {
    bookmarksHook.resetBookmarkForm();
    modalsHook.openBookmarkModal();
  };

  const handleBookmarkEdit = (bookmark: BookmarkType) => {
    bookmarksHook.openEditBookmark(bookmark);
    modalsHook.openBookmarkModal();
  };

  // モーダル閉じる際のクリーンアップ処理
  const handleTopicModalClose = () => {
    modalsHook.closeTopicModal();
    topicsHook.resetTopicForm();
  };

  const handleBookmarkModalClose = () => {
    modalsHook.closeBookmarkModal();
    bookmarksHook.resetBookmarkForm();
  };

  // AI質問ハンドラー
  const handleAiQuestion = (bookmark: BookmarkType) => {
    setSelectedBookmark(bookmark);
    setShowAiModal(true);
  };

  const handleAiModalClose = () => {
    setShowAiModal(false);
    setSelectedBookmark(null);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-amber-50 dark:bg-background">
        {/* トピック選択サイドバー */}
        <TopicSidebar
          topics={topicsHook.topics}
          selectedTopicId={topicsHook.selectedTopicId}
          onTopicSelect={topicsHook.setSelectedTopicId}
          onTopicEdit={handleTopicEdit}
          onTopicDelete={topicsHook.handleDeleteTopic}
          onTopicCreate={handleTopicCreate}
          showTopicModal={modalsHook.showTopicModal}
          setShowTopicModal={modalsHook.setShowTopicModal}
        />

        <SidebarInset className="flex-1">
          {/* ヘッダー */}
          <header className="flex shrink-0 items-center justify-between p-6 bg-white dark:bg-card">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-amber-100 dark:hover:bg-accent rounded-lg" />
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-foreground">
                  {topicsHook.selectedTopic?.title || "トピックを選択"}
                </h2>
              </div>
            </div>

            {/* 操作ボタンエリア */}
            <div className="flex items-center gap-3">
              {/* カラーテーマトグル */}
              <ColorThemeToggle />
              {/* ダークモードトグル */}
              <ModeToggle />

              {/* トピック選択時のみ表示される新規ブックマークボタン */}
              {topicsHook.selectedTopic && (
                <Dialog
                  open={modalsHook.showBookmarkModal}
                  onOpenChange={modalsHook.setShowBookmarkModal}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-80 text-white rounded-xl shadow-sm"
                      onClick={handleBookmarkCreate}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      新しいブックマーク
                    </Button>
                  </DialogTrigger>
                </Dialog>
              )}
            </div>
          </header>

          {/* トピック説明文セクション（長い説明文の場合のみ表示） */}
          {topicsHook.selectedTopic?.description &&
            topicsHook.selectedTopic.description.length > 100 && (
              <div className="border-b border-amber-200 dark:border-border bg-white dark:bg-card px-6 py-4">
                <div
                  className={`text-gray-700 dark:text-foreground leading-relaxed ${
                    !modalsHook.isDescriptionExpanded &&
                    topicsHook.selectedTopic.description.length > 100
                      ? "line-clamp-3"
                      : ""
                  }`}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {topicsHook.selectedTopic.description}
                </div>

                {/* 長い説明文の場合は展開/折りたたみボタンを表示 */}
                {topicsHook.selectedTopic.description.length > 100 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={modalsHook.toggleDescriptionExpansion}
                    className="mt-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-accent rounded-lg"
                  >
                    {modalsHook.isDescriptionExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        折りたたむ
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        もっと見る
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}

          {/* ブックマーク一覧表示エリア */}
          <main className="flex-1 p-6 overflow-y-auto">
            <BookmarkGrid
              bookmarks={bookmarksHook.bookmarks}
              selectedTopic={topicsHook.selectedTopic}
              isLoading={!!bookmarksHook.isLoading}
              onBookmarkEdit={handleBookmarkEdit}
              onBookmarkDelete={bookmarksHook.handleDeleteBookmark}
              onBookmarkCreate={handleBookmarkCreate}
              onAiQuestion={handleAiQuestion}
              showBookmarkModal={modalsHook.showBookmarkModal}
              setShowBookmarkModal={modalsHook.setShowBookmarkModal}
            />
          </main>
        </SidebarInset>
      </div>

      {/* モーダル群 */}
      <TopicModal
        isOpen={modalsHook.showTopicModal}
        onClose={handleTopicModalClose}
        editingTopic={topicsHook.editingTopic}
        topicForm={topicsHook.topicForm}
        setTopicForm={topicsHook.setTopicForm}
        onSubmit={handleTopicModalSubmit}
      />

      <BookmarkModal
        isOpen={modalsHook.showBookmarkModal}
        onClose={handleBookmarkModalClose}
        editingBookmark={bookmarksHook.editingBookmark}
        topics={topicsHook.topics}
        bookmarkForm={bookmarksHook.bookmarkForm}
        setBookmarkForm={bookmarksHook.setBookmarkForm}
        onSubmit={handleBookmarkModalSubmit}
      />

      <AiQuestionModal
        isOpen={showAiModal}
        onClose={handleAiModalClose}
        bookmark={selectedBookmark}
      />
    </SidebarProvider>
  );
};
