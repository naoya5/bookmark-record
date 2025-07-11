"use client";

/**
 * ブックマークグリッド表示コンポーネント
 *
 * 選択されたトピックに属するブックマークを
 * グリッドレイアウトで表示し、編集・削除機能を提供します。
 */

import React from "react";
import Image from "next/image";
import {
  Edit,
  Trash2,
  ExternalLink,
  Globe,
  Plus,
  Bookmark,
  Folder,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Bookmark as BookmarkType } from "@/lib/generated/prisma/client";
import { TopicWithBookmarkCount } from "@/hooks/use-topics";
import { extractDomain, getFaviconUrl } from "@/lib/utils/url";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * BookmarkGridコンポーネントのプロパティ
 */
interface BookmarkGridProps {
  bookmarks: BookmarkType[];
  selectedTopic: TopicWithBookmarkCount | undefined;
  isLoading: boolean;
  onBookmarkEdit: (bookmark: BookmarkType) => void;
  onBookmarkDelete: (bookmarkId: string) => void;
  onBookmarkCreate: () => void;
  onAiQuestion?: (bookmark: BookmarkType) => void;
  showBookmarkModal: boolean;
  setShowBookmarkModal: (show: boolean) => void;
}

export const BookmarkGrid: React.FC<BookmarkGridProps> = ({
  bookmarks,
  selectedTopic,
  isLoading,
  onBookmarkEdit,
  onBookmarkDelete,
  onBookmarkCreate,
  onAiQuestion,
  showBookmarkModal,
  setShowBookmarkModal,
}) => {
  // ローディング状態の表示
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-amber-600">読み込み中...</div>
      </div>
    );
  }

  // トピック未選択時の案内表示
  if (!selectedTopic) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4">
          <Folder className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          トピックを選択
        </h3>
        <p className="text-gray-600">
          サイドバーからトピックを選択して、ブックマークを表示・管理してください。
        </p>
      </div>
    );
  }

  // ブックマーク未登録時の案内表示
  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4">
          <Bookmark className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          まだブックマークがありません
        </h3>
        <p className="text-gray-600 mb-6">
          このトピックに最初のブックマークを追加してください
        </p>
        <Dialog open={showBookmarkModal} onOpenChange={setShowBookmarkModal}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-80 text-white rounded-xl shadow-sm"
              onClick={onBookmarkCreate}
            >
              <Plus className="w-4 h-4 mr-2" />
              ブックマーク追加
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
    );
  }

  // ブックマーク一覧のグリッド表示
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <Card
          key={bookmark.id}
          className="group hover:shadow-lg transition-all border-amber-200 hover:border-amber-300 rounded-xl"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* ファビコン表示エリア */}
                <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0 relative">
                  {getFaviconUrl(bookmark.url) ? (
                    <>
                      <Image
                        src={getFaviconUrl(bookmark.url)!}
                        alt=""
                        width={24}
                        height={24}
                        className="w-6 h-6"
                        onError={(e) => {
                          // ファビコン読み込み失敗時にフォールバックアイコンを表示
                          const target = e.currentTarget;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            const globeIcon = parent.querySelector(
                              ".globe-icon"
                            ) as HTMLElement;
                            if (globeIcon) globeIcon.style.display = "block";
                          }
                        }}
                      />
                      <Globe
                        className="globe-icon w-4 h-4 text-amber-600 absolute"
                        style={{ display: "none" }}
                      />
                    </>
                  ) : (
                    <Globe className="w-4 h-4 text-amber-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-base leading-tight">
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-700 hover:text-amber-800 font-semibold transition-colors flex items-center gap-1"
                    >
                      {extractDomain(bookmark.url)}
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  </CardTitle>
                </div>
              </div>
              {/* ホバー時に表示される操作ボタン */}
              <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                <TooltipProvider>
                  {onAiQuestion && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-amber-50"
                          onClick={() => onAiQuestion(bookmark)}
                        >
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>AIに質問</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-amber-50"
                        onClick={() => onBookmarkEdit(bookmark)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>編集</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl border border-red-200">
                          <AlertDialogHeader>
                            <AlertDialogTitle>ブックマークを削除</AlertDialogTitle>
                            <AlertDialogDescription>
                              このブックマークを削除してもよろしいですか？
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">
                              キャンセル
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onBookmarkDelete(bookmark.id)}
                              className="bg-red-600 text-white hover:bg-red-700 rounded-xl"
                            >
                              削除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>削除</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-sm text-gray-700 leading-relaxed mb-3">
              {bookmark.description}
            </CardDescription>
            <p className="text-xs text-gray-500 truncate bg-gray-50 px-2 py-1 rounded-lg">
              {bookmark.url}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
