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