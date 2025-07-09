# ブックマーク管理アプリケーション

![ホームページ](homepage-screenshot.png)

トピック（カテゴリ）別にWebページのブックマークを整理・管理できるアプリケーションです。

## 概要

このアプリケーションは、Webページのブックマークを効率的に管理するためのツールです。トピック（カテゴリ）を作成し、そのトピックに関連するブックマークを整理できます。

### 主な機能

- **トピック管理**: ブックマークを整理するためのカテゴリ（トピック）を作成・編集・削除
- **ブックマーク管理**: URLとコメントを含むブックマークの作成・編集・削除
- **階層的な整理**: トピックごとにブックマークを分類して管理
- **レスポンシブデザイン**: デスクトップとモバイルデバイスの両方に対応

### 使用技術

- **フロントエンド**: Next.js 15, React 19, TypeScript
- **スタイリング**: Tailwind CSS, Radix UI
- **データベース**: SQLite（Prisma ORM）
- **状態管理**: SWR
- **その他**: Lucide React（アイコン）、date-fns（日付処理）

## 技術仕様

このプロジェクトは [Next.js](https://nextjs.org) フレームワークを使用して構築されており、[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) でブートストラップされています。

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
