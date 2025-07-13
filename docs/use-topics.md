# `useTopics` Hook Documentation

`useTopics` は、トピックの管理機能を提供するカスタムフックです。トピックの取得、作成、更新、削除機能と、選択されたトピックの状態管理を行います。

## 概要

このフックは `useSWR` を内部で使用し、API (`/api/topics`) からトピックデータをリアルタイムで取得・更新します。また、初期データを静的に渡すことも可能です。

## インポート方法

```typescript
import { useTopics } from '@/hooks/use-topics';
```

## 基本的な使い方

```tsx
import { useTopics } from '@/hooks/use-topics';

const TopicsComponent = () => {
  const { topics, selectedTopic, setSelectedTopicId } = useTopics();

  if (!topics.length) {
    return <div>No topics found.</div>;
  }

  return (
    <div>
      <ul>
        {topics.map(topic => (
          <li key={topic.id} onClick={() => setSelectedTopicId(topic.id)}>
            {topic.title}
          </li>
        ))}
      </ul>
      {selectedTopic && (
        <div>
          <h2>Selected: {selectedTopic.title}</h2>
          <p>{selectedTopic.description}</p>
        </div>
      )}
    </div>
  );
};
```

## パラメータ

### `initialTopics` (任意)

-   **型:** `TopicWithBookmarkCount[]`
-   **デフォルト:** `[]`
-   **説明:** コンポーネントの初期描画時に使用されるトピックの配列。SWRによるデータ取得が完了するまでのフォールバックとして機能します。

## 返り値

`useTopics` フックは以下のプロパティとメソッドを含むオブジェクトを返します。

### データ

-   `topics: TopicWithBookmarkCount[]`
    -   現在のトピックのリスト。SWRで取得したデータがあればそれを、なければ `initialTopics` を返します。
-   `selectedTopic: TopicWithBookmarkCount | undefined`
    -   現在選択されているトピックオブジェクト。
-   `selectedTopicId: string`
    -   現在選択されているトピックのID。
-   `isLoading: boolean`
    -   データ取得中かどうかを示すフラグ。
-   `isError: any`
    -   データ取得時にエラーが発生した場合のエラーオブジェクト。

### フォーム状態

-   `topicForm: { emoji: string; title: string; description: string; }`
    -   トピック作成・編集フォームの状態を管理するオブジェクト。
-   `setTopicForm: React.Dispatch<React.SetStateAction<{...}>>`
    -   `topicForm` の状態を更新する関数。
-   `editingTopic: TopicWithBookmarkCount | null`
    -   現在編集中のトピックオブジェクト。編集モードでない場合は `null`。

### 操作関数

-   `setSelectedTopicId(id: string): void`
    -   表示するトピックを選択します。
-   `openEditTopic(topic: TopicWithBookmarkCount): void`
    -   指定されたトピックを編集モードで開きます。フォームがそのトピックの内容で更新されます。
-   `resetTopicForm(): void`
    -   フォームの内容と編集状態をリセットします。
-   `handleCreateTopic(): Promise<boolean>`
    -   フォームの内容を元に新しいトピックを作成します。成功時に `true` を返します。
-   `handleUpdateTopic(): Promise<boolean>`
    -   編集中のトピックをフォームの内容で更新します。成功時に `true` を返します。
-   `handleDeleteTopic(topicId: string): Promise<boolean>`
    -   指定されたIDのトピックを削除します。成功時に `true` を返します。
-   `mutateTopics(): Promise<TopicWithBookmarkCount[] | undefined>`
    -   SWRキャッシュを手動で再検証（更新）します。

## 型定義

### `TopicWithBookmarkCount`

APIから返される、ブックマーク数を含む拡張された `Topic` 型です。

```typescript
import { Topic } from "@prisma/client";

export interface TopicWithBookmarkCount extends Topic {
  bookmarkCount: number;
}
```
