# `useBookmarks` Hook Documentation

`useBookmarks` は、特定のトピックに紐づくブックマークの管理機能を提供するカスタムフックです。ブックマークの取得、作成、更新、削除機能を提供します。

## 概要

このフックは `useSWR` を内部で使用し、API (`/api/bookmarks`) からブックマークデータをリアルタイムで取得・更新します。`topicId` が指定された場合に、そのトピックに関連するブックマークを取得します。

## インポート方法

```typescript
import { useBookmarks } from '@/hooks/use-bookmarks';
```

## 基本的な使い方

```tsx
import { useBookmarks } from '@/hooks/use-bookmarks';

const BookmarksComponent = ({ topicId }) => {
  const { bookmarks, isLoading, isError } = useBookmarks(topicId);

  if (isLoading) return <div>Loading bookmarks...</div>;
  if (isError) return <div>Failed to load bookmarks.</div>;

  return (
    <div>
      <h2>Bookmarks</h2>
      <ul>
        {bookmarks.map(bookmark => (
          <li key={bookmark.id}>
            <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
              {bookmark.description || bookmark.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

## パラメータ

### `topicId`
- **型:** `string | null`
- **説明:** ブックマークを取得する対象のトピックID。`null` の場合、データ取得は行われません。

### `mutateTopics` (任意)
- **型:** `() => void`
- **説明:** ブックマークの作成、更新、削除時に呼び出されるコールバック関数。通常はトピックリストの再検証（例: ブックマーク数の更新）のために使用されます。

## 返り値

`useBookmarks` フックは以下のプロパティとメソッドを含むオブジェクトを返します。

### データ

-   `bookmarks: BookmarkType[]`
    -   現在のブックマークのリスト。データがない場合は空の配列 `[]` を返します。
-   `isLoading: boolean`
    -   データ取得中かどうかを示すフラグ。
-   `isError: any`
    -   データ取得時にエラーが発生した場合のエラーオブジェクト。

### フォーム状態

-   `bookmarkForm: { topicId: string; url: string; description: string; }`
    -   ブックマーク作成・編集フォームの状態を管理するオブジェクト。
-   `setBookmarkForm: React.Dispatch<React.SetStateAction<{...}>>`
    -   `bookmarkForm` の状態を更新する関数。
-   `editingBookmark: BookmarkType | null`
    -   現在編集中のブックマークオブジェクト。編集モードでない場合は `null`。

### 操作関数

-   `openEditBookmark(bookmark: BookmarkType): void`
    -   指定されたブックマークを編集モードで開きます。フォームがそのブックマークの内容で更新されます。
-   `resetBookmarkForm(): void`
    -   フォームの内容と編集状態をリセットします。
-   `handleCreateBookmark(): Promise<boolean>`
    -   フォームの内容を元に新しいブックマークを作成します。成功時に `true` を返します。
-   `handleUpdateBookmark(): Promise<boolean>`
    -   編集中のブックマークをフォームの内容で更新します。成功時に `true` を返します。
-   `handleDeleteBookmark(bookmarkId: string): Promise<boolean>`
    -   指定されたIDのブックマークを削除します。成功時に `true` を返します。
-   `mutateBookmarks(): Promise<BookmarkType[] | undefined>`
    -   SWRキャッシュを手動で再検証（更新）します。

## 型定義

### `BookmarkType`

Prismaによって生成される `Bookmark` 型です。

```typescript
import { Bookmark as BookmarkType } from "@/lib/generated/prisma";
```
