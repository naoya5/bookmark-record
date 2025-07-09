import { useState, useEffect } from "react";
import useSWR from "swr";
import { Bookmark as BookmarkType } from "@/lib/generated/prisma";

//fetcher関数を定義
const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * ブックマーク管理機能を提供するカスタムフック
 *
 * 指定されたトピックのブックマークの取得、作成、更新、削除、
 * および一括作成機能を提供します。SWRを使用してデータの
 * キャッシュと自動再取得を行います。
 */

export const useBookmarks = (
  topicId: string | null,
  mutateTopics?: () => void
) => {
  // SWRを使用してブックマークデータを取得・キャッシュ
  const { data, error, mutate } = useSWR<BookmarkType[]>(
    topicId ? `/api/bookmarks?topicId=${topicId}` : null,
    fetcher
  );

  const [editingBookmark, setEditingBookmark] = useState<BookmarkType | null>(
    null
  );
  const [bookmarkForm, setBookmarkForm] = useState({
    topicId: topicId || "",
    url: "",
    description: "",
  });
  // 選択されたトピックが変更された時にフォームのトピックIDを更新
  useEffect(() => {
    setBookmarkForm((prev) => ({ ...prev, topicId: topicId || "" }));
  }, [topicId]);

  //フォームのリセット
  const resetBookmarkForm = () => {
    setBookmarkForm({
      topicId: topicId || "",
      url: "",
      description: "",
    });
    setEditingBookmark(null);
  };

  //ブックマークの編集
  const openEditBookmark = (bookmark: BookmarkType) => {
    setEditingBookmark(bookmark);
    setBookmarkForm({
      topicId: bookmark.topicId,
      url: bookmark.url,
      description: bookmark.description || "",
    });
  };

  //ブックマークの作成
  const handleCreateBookmark = async () => {
    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: bookmarkForm.url,
          description: bookmarkForm.description,
          topicId: bookmarkForm.topicId,
        }),
      });

      if (response.ok) {
        // ブックマークリストとトピックリスト（ブックマーク数更新のため）を再取得
        await mutate();
        if (mutateTopics) await mutateTopics();
        resetBookmarkForm();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating bookmark:", error);
      return false;
    }
  };

  //ブックマークの更新
  const handleUpdateBookmark = async () => {
    if (!editingBookmark) return false;

    try {
      const response = await fetch(`/api/bookmarks/${editingBookmark.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: bookmarkForm.url,
          description: bookmarkForm.description,
          topicId: bookmarkForm.topicId,
        }),
      });

      if (response.ok) {
        await mutate();
        if (mutateTopics) await mutateTopics();
        resetBookmarkForm();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating bookmark:", error);
      return false;
    }
  };

  //ブックマークの削除
  const handleDeleteBookmark = async (bookmarkId: string) => {
    try {
      const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // ブックマーク削除後、関連するデータを再取得
        await mutate();
        if (mutateTopics) await mutateTopics();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      return false;
    }
  };

  return {
    // データ
    bookmarks: data || [],
    isLoading: !error && !data && topicId,
    isError: error,

    // フォーム状態
    bookmarkForm,
    setBookmarkForm,
    editingBookmark,

    // 操作関数
    openEditBookmark,
    resetBookmarkForm,
    handleCreateBookmark,
    handleUpdateBookmark,
    handleDeleteBookmark,
    mutateBookmarks: mutate,
  };
};
