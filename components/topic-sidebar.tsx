"use client";

/**
 * トピックサイドバーコンポーネント
 *
 * ブックマークを分類するトピック一覧を表示し、
 * トピックの選択・作成・編集・削除機能を提供します。
 */

import React from "react";
import { Plus, Edit, Trash2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { TopicWithBookmarkCount } from "@/hooks/use-topics";
import { formatDate } from "@/lib/utils/date";

/**
 * TopicSidebarコンポーネントのプロパティ
 */
interface TopicSidebarProps {
  topics: TopicWithBookmarkCount[];
  selectedTopicId: string;
  onTopicSelect: (topicId: string) => void;
  onTopicEdit: (topic: TopicWithBookmarkCount) => void;
  onTopicDelete: (topicId: string) => void;
  onTopicCreate: () => void;
  showTopicModal: boolean;
  setShowTopicModal: (show: boolean) => void;
}

export const TopicSidebar: React.FC<TopicSidebarProps> = ({
  topics,
  selectedTopicId,
  onTopicSelect,
  onTopicEdit,
  onTopicDelete,
  onTopicCreate,
  showTopicModal,
  setShowTopicModal,
}) => {
  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar shadow-sm">
      {/* サイドバーヘッダー */}
      <SidebarHeader className="border-b border-sidebar-border p-6 pr-0 bg-sidebar">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Bookmark className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">
              ブックマークレコード
            </h1>
            <p className="text-xs text-sidebar-foreground/70">
              シンプルにリンクを管理！
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          {/* トピック一覧のヘッダー */}
          <SidebarGroupLabel className="flex items-center justify-between px-3 py-6">
            <span className="text-sm font-semibold text-sidebar-foreground">
              トピック
            </span>
            <Dialog open={showTopicModal} onOpenChange={setShowTopicModal}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-sidebar-accent text-sidebar-foreground"
                  onClick={onTopicCreate}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </DialogTrigger>
            </Dialog>
          </SidebarGroupLabel>

          {/* トピック一覧 */}
          <SidebarGroupContent className="px-2">
            <SidebarMenu className="space-y-2">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => onTopicSelect(topic.id)}
                  className={`p-3 rounded-xl border cursor-pointer shadow-sm group transition-colors ${
                    selectedTopicId === topic.id
                      ? "bg-sidebar-accent border-sidebar-primary text-sidebar-accent-foreground"
                      : "bg-card border-sidebar-border hover:bg-sidebar-accent/50 hover:border-sidebar-primary text-card-foreground"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="text-2xl flex-shrink-0 mt-0.5">
                        {topic.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate text-sm">
                          {topic.title}
                        </h3>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-primary font-medium">
                            {topic.bookmarkCount} 個
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(topic.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* ホバー時に表示される操作ボタン */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          // イベントバブリングを防止してトピック選択を回避
                          e.stopPropagation();
                          onTopicEdit(topic);
                        }}
                        className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-sidebar-accent"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            onClick={(e) => {
                              // イベントバブリングを防止してトピック選択を回避
                              e.stopPropagation();
                            }}
                            className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl border border-destructive/20">
                          <AlertDialogHeader>
                            <AlertDialogTitle>トピックを削除</AlertDialogTitle>
                            <AlertDialogDescription>
                              このトピックとすべてのブックマークを削除してもよろしいですか？
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">
                              キャンセル
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onTopicDelete(topic.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                            >
                              削除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
