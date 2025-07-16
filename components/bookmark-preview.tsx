"use client";

import { usePreview } from "@/hooks/use-preview";
import { getFaviconUrl } from "@/lib/utils/url";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Globe, ExternalLink, AlertCircle, User, Calendar } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

interface BookmarkPreviewProps {
  url: string;
  domain?: string;
}

// プレビューデータの型定義を拡張
interface PreviewData {
  title: string;
  description: string;
  image: string;
  siteName: string;
  url: string;
  author?: string;
  publishedAt?: string;
  tags?: string[];
}

export function BookmarkPreview({ url, domain }: BookmarkPreviewProps) {
  const { previewData, isLoading, isError, hasData, startPreview } =
    usePreview(url);
  const [imageError, setImageError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  // コンポーネントがマウントされたときにプレビューを開始
  useEffect(() => {
    if (url) {
      startPreview();
    }
  }, [url, startPreview]);

  // 公開日をフォーマット
  const formatPublishedDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: ja });
    } catch {
      return dateString;
    }
  };

  // エラー時のフォールバック表示
  if (isError) {
    return (
      <Card className="w-80 border-destructive/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <CardTitle className="text-sm">
              プレビューを取得できません
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {!faviconError ? (
              <Image
                src={getFaviconUrl(url) || ""}
                alt="サイトアイコン"
                width={16}
                height={16}
                onError={() => setFaviconError(true)}
                className="rounded"
              />
            ) : (
              <Globe className="h-4 w-4" />
            )}
            <span className="truncate">{domain || new URL(url).hostname}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ローディング中の表示
  if (isLoading) {
    return (
      <Card className="w-80">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <Skeleton className="h-32 w-full rounded" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // データが正常に取得できた場合の表示
  if (hasData && previewData) {
    const data = previewData as PreviewData;

    return (
      <Card className="w-80 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              {!faviconError ? (
                <Image
                  src={getFaviconUrl(url) || ""}
                  alt="サイトアイコン"
                  width={16}
                  height={16}
                  onError={() => setFaviconError(true)}
                  className="rounded flex-shrink-0"
                />
              ) : (
                <Globe className="h-4 w-4 flex-shrink-0" />
              )}
              <CardTitle className="text-sm truncate">
                {data.siteName || domain || new URL(url).hostname}
              </CardTitle>
            </div>
            <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-3">
          {/* サムネイル画像 */}
          {data.image && data.image.trim() && !imageError && (
            <div className="relative h-32 w-full overflow-hidden rounded-md bg-muted">
              <Image
                src={data.image}
                alt={data.title || "サイトプレビュー"}
                fill
                sizes="(max-width: 320px) 100vw, 320px"
                className="object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          )}

          {/* タイトル */}
          {data.title && (
            <div>
              <h4 className="font-medium text-sm line-clamp-2 leading-tight">
                {data.title}
              </h4>
            </div>
          )}

          {/* 著者と公開日 */}
          {(data.author || data.publishedAt) && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {data.author && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="truncate max-w-[120px]">{data.author}</span>
                </div>
              )}
              {data.publishedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatPublishedDate(data.publishedAt)}</span>
                </div>
              )}
            </div>
          )}

          {/* 説明文 */}
          {data.description && (
            <CardDescription className="text-xs line-clamp-3 leading-relaxed">
              {data.description}
            </CardDescription>
          )}

          {/* タグ */}
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {data.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs px-2 py-0.5"
                >
                  {tag}
                </Badge>
              ))}
              {data.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{data.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* URL表示 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground truncate">
              {new URL(url).hostname}
            </span>
            {data.siteName && (
              <Badge variant="secondary" className="text-xs">
                {data.siteName}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // データがない場合のフォールバック表示
  return (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {!faviconError ? (
            <Image
              src={getFaviconUrl(url) || ""}
              alt="サイトアイコン"
              width={16}
              height={16}
              onError={() => setFaviconError(true)}
              className="rounded"
            />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          <CardTitle className="text-sm truncate">
            {domain || new URL(url).hostname}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-xs">
          このサイトのプレビュー情報はありません
        </CardDescription>
      </CardContent>
    </Card>
  );
}
