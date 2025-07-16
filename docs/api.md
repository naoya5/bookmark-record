# API仕様書

このドキュメントは、APIエンドポイントの仕様を概説します。

## トピック API

ベースパス: `/api/topics`

### GET /api/topics

- **説明:** すべてのトピックのリストを、各トピックのブックマーク数を含めて取得します。
- **レスポンス (200 OK):** トピックオブジェクトの配列。
  ```json
  [
    {
      "id": "string",
      "title": "string",
      "description": "string | null",
      "emoji": "string",
      "createdAt": "DateTime",
      "updatedAt": "DateTime",
      "bookmarkCount": "number"
    }
  ]
  ```

### POST /api/topics

- **説明:** 新しいトピックを作成します。
- **リクエストボディ:**
  ```json
  {
    "title": "string",
    "description": "string | null",
    "emoji": "string | null"
  }
  ```
- **レスポンス (201 Created):** 作成されたトピックオブジェクト。
  ```json
  {
    "id": "string",
    "title": "string",
    "description": "string | null",
    "emoji": "string",
    "createdAt": "DateTime",
    "updatedAt": "DateTime",
    "bookmarkCount": 0
  }
  ```

### GET /api/topics/:id

- **説明:** IDで特定のトピックを、ブックマーク数を含めて取得します。
- **パラメータ:**
  - `id` (string): トピックのID。
- **レスポンス (200 OK):** 要求されたトピックオブジェクト。
- **レスポンス (404 Not Found):** トピックが存在しない場合。

### PUT /api/topics/:id

- **説明:** 特定のトピックを更新します。
- **パラメータ:**
  - `id` (string): 更新するトピックのID。
- **リクエストボディ:**
  ```json
  {
    "title": "string",
    "description": "string | null",
    "emoji": "string | null"
  }
  ```
- **レスポンス (200 OK):** 更新されたトピックオブジェクト。
- **レスポンス (404 Not Found):** トピックが存在しない場合。

### DELETE /api/topics/:id

- **説明:** 特定のトピックとそれに関連するすべてのブックマークを削除します。
- **パラメータ:**
  - `id` (string): 削除するトピックのID。
- **レスポンス (200 OK):**
  ```json
  {
    "message": "Topic deleted successfully"
  }
  ```
- **レスポンス (404 Not Found):** トピックが存在しない場合。

---

## ブックマーク API

ベースパス: `/api/bookmarks`

### GET /api/bookmarks

- **説明:** 特定のトピックのブックマークのリストを取得します。
- **クエリパラメータ:**
  - `topicId` (string, 必須): ブックマークを取得するトピックのID。
- **レスポンス (200 OK):** ブックマークオブジェクトの配列。
  ```json
  [
    {
      "id": "string",
      "url": "string",
      "description": "string | null",
      "createdAt": "DateTime",
      "updatedAt": "DateTime",
      "topicId": "string"
    }
  ]
  ```

### POST /api/bookmarks

- **説明:** 新しいブックマークを作成します。
- **リクエストボディ:**
  ```json
  {
    "url": "string",
    "description": "string | null",
    "topicId": "string"
  }
  ```
- **レスポンス (201 Created):** 作成されたブックマークオブジェクト。

### GET /api/bookmarks/:id

- **説明:** IDで特定のブックマークを取得します。
- **パラメータ:**
  - `id` (string): ブックマークのID。
- **レスポンス (200 OK):** 要求されたブックマークオブジェクト。
- **レスポンス (404 Not Found):** ブックマークが存在しない場合。

### PUT /api/bookmarks/:id

- **説明:** 特定のブックマークを更新します。
- **パラメータ:**
  - `id` (string): 更新するブックマークのID。
- **リクエストボディ:**
  ```json
  {
    "url": "string",
    "description": "string | null",
    "topicId": "string"
  }
  ```
- **レスポンス (200 OK):** 更新されたブックマークオブジェクト。
- **レスポンス (404 Not Found):** ブックマークが存在しない場合。

### DELETE /api/bookmarks/:id

- **説明:** 特定のブックマークを削除します。
- **パラメータ:**
  - `id` (string): 削除するブックマークのID。
- **レスポンス (200 OK):**
  ```json
  {
    "message": "Bookmark deleted successfully"
  }
  ```
- **レスポンス (404 Not Found):** ブックマークが存在しない場合。

---

## プレビュー API

ベースパス: `/api/bookmarks/preview`

### GET /api/bookmarks/preview

- **説明:** 指定されたURLのメタデータ（タイトル、説明、画像など）を取得してプレビュー表示用の情報を提供します。
- **クエリパラメータ:**
  - `url` (string, 必須): プレビューを取得したいURL。
- **レスポンス (200 OK):** URLのメタデータオブジェクト。
  ```json
  {
    "title": "string",
    "description": "string",
    "image": "string",
    "siteName": "string",
    "url": "string"
  }
  ```
- **レスポンス (400 Bad Request):** URLパラメータが不正または欠落している場合。
  ```json
  {
    "error": "URLパラメータが必要です"
  }
  ```
- **レスポンス (500 Internal Server Error):** サーバーエラーが発生した場合。

---

## AI分析 API

ベースパス: `/api/ai/analyze-url`

### POST /api/ai/analyze-url

- **説明:** URLの内容をAIで分析し、ユーザーの質問に基づいて回答を生成します。OpenAI GPT-3.5-turboを使用します。
- **リクエストボディ:**
  ```json
  {
    "url": "string",
    "question": "string"
  }
  ```
- **レスポンス (200 OK):** AI分析結果オブジェクト。
  ```json
  {
    "answer": "string",
    "urlContent": "string"
  }
  ```
- **レスポンス (400 Bad Request):** リクエストパラメータが不正または欠落している場合。
  ```json
  {
    "error": "URLと質問は必須です"
  }
  ```
- **レスポンス (500 Internal Server Error):** OpenAI APIキーが未設定またはサーバーエラーが発生した場合。
  ```json
  {
    "error": "OpenAI APIキーが設定されていません。.env.localファイルにOPENAI_API_KEYを設定してください。",
    "details": "OpenAI APIキーは https://platform.openai.com/api-keys から取得できます。"
  }
  ```

## 環境設定

### 必要な環境変数

```env
# OpenAI APIキー（AI分析機能で使用）
OPENAI_API_KEY=your_openai_api_key_here
```

### 依存関係

- `cheerio`: HTMLパースとメタデータ抽出
- `openai`: OpenAI API クライアント