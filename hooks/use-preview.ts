import { useState, useCallback } from "react";
import useSWR from "swr";

// プレビューデータの型定義
export interface PreviewData {
  title: string;
  description: string;
  image: string;
  siteName: string;
  url: string;
}

// fetcher関数を定義
const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
});

/**
 * プレビュー機能を提供するカスタムフック
 * 
 * URLのメタデータを取得し、プレビュー表示に必要な情報を提供します。
 * SWRを使用してデータのキャッシュと自動再取得を行います。
 */
export const usePreview = (url: string | null) => {
  const [shouldFetch, setShouldFetch] = useState(false);
  
  // SWRを使用してプレビューデータを取得・キャッシュ
  const { data, error, mutate } = useSWR<PreviewData>(
    shouldFetch && url ? `/api/bookmarks/preview?url=${encodeURIComponent(url)}` : null,
    fetcher,
    {
      // プレビューデータは頻繁に変更されないため、キャッシュ時間を長めに設定
      dedupingInterval: 30000, // 30秒間は同じリクエストを重複排除
      revalidateOnFocus: false, // フォーカス時の再検証を無効化
      revalidateOnReconnect: false, // 再接続時の再検証を無効化
    }
  );

  // プレビュー取得を開始する関数
  const startPreview = useCallback(() => {
    if (url && !shouldFetch) {
      setShouldFetch(true);
    }
  }, [url, shouldFetch]);

  // プレビュー取得を停止する関数
  const stopPreview = useCallback(() => {
    setShouldFetch(false);
  }, []);

  // プレビューデータを手動で再取得する関数
  const refreshPreview = useCallback(() => {
    if (url) {
      mutate();
    }
  }, [url, mutate]);

  // プレビューデータを事前に取得する関数（ホバー時の遅延対策）
  const prefetchPreview = useCallback(() => {
    if (url && !data && !error) {
      startPreview();
    }
  }, [url, data, error, startPreview]);

  // ローディング状態の判定
  const isLoading = shouldFetch && !error && !data && !!url;

  // エラー状態の判定
  const isError = !!error;

  // データが利用可能かの判定
  const hasData = !!data && !error;

  return {
    // データ
    previewData: data,
    isLoading,
    isError,
    hasData,
    error,

    // 操作関数
    startPreview,
    stopPreview,
    refreshPreview,
    prefetchPreview,
  };
};