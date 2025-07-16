import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

/**
 * プラットフォーム別の特別な処理
 */
interface PlatformData {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  author?: string;
  publishedAt?: string;
  tags?: string[];
}

interface PlatformHandler {
  match: (url: string) => boolean;
  extract: (url: string, $: cheerio.Root) => PlatformData;
}

const platformHandlers: PlatformHandler[] = [
  // Zenn
  {
    match: (url: string) => url.includes("zenn.dev"),
    extract: (url: string, $: cheerio.Root): PlatformData => {
      const title =
        $('meta[property="og:title"]').attr("content") ||
        $("h1").first().text() ||
        "";
      const description =
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        "";
      const image = $('meta[property="og:image"]').attr("content") || "";
      const author =
        $('meta[name="author"]').attr("content") ||
        $(".author-name").text() ||
        $('[data-testid="author-name"]').text() ||
        "";

      // Zennの記事タグを取得
      const tags: string[] = [];
      $(".tag-item, .tag").each((_, el) => {
        const tagText = $(el).text().trim();
        if (tagText) tags.push(tagText);
      });

      return {
        title: title.trim(),
        description: description.trim(),
        image: image.trim(),
        siteName: "Zenn",
        author: author.trim(),
        tags,
      };
    },
  },

  // Qiita
  {
    match: (url: string) => url.includes("qiita.com"),
    extract: (url: string, $: cheerio.Root): PlatformData => {
      const title =
        $('meta[property="og:title"]').attr("content") ||
        $("h1").first().text() ||
        "";
      const description =
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        "";
      const image = $('meta[property="og:image"]').attr("content") || "";
      const author =
        $('meta[name="author"]').attr("content") ||
        $(".user-name").text() ||
        $("[data-hyperapp-props]").attr("data-hyperapp-props") ||
        "";

      // Qiitaの記事タグを取得
      const tags: string[] = [];
      $(".tag, .tag-item, [data-tag]").each((_, el) => {
        const tagText = $(el).text().trim();
        if (tagText && !tags.includes(tagText)) tags.push(tagText);
      });

      // 公開日を取得
      const publishedAt =
        $('meta[property="article:published_time"]').attr("content") ||
        $("time").attr("datetime") ||
        "";

      return {
        title: title.trim(),
        description: description.trim(),
        image: image.trim(),
        siteName: "Qiita",
        author: author.trim(),
        publishedAt: publishedAt.trim(),
        tags,
      };
    },
  },

  // note.com
  {
    match: (url: string) => url.includes("note.com"),
    extract: (url: string, $: cheerio.Root): PlatformData => {
      const title =
        $('meta[property="og:title"]').attr("content") ||
        $("h1").first().text() ||
        "";
      const description =
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        "";
      const image = $('meta[property="og:image"]').attr("content") || "";
      const author =
        $('meta[name="author"]').attr("content") ||
        $(".note-author-name").text() ||
        "";

      return {
        title: title.trim(),
        description: description.trim(),
        image: image.trim(),
        siteName: "note",
        author: author.trim(),
      };
    },
  },

  // Medium
  {
    match: (url: string) =>
      url.includes("medium.com") || url.includes(".medium.com"),
    extract: (url: string, $: cheerio.Root): PlatformData => {
      const title =
        $('meta[property="og:title"]').attr("content") ||
        $("h1").first().text() ||
        "";
      const description =
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        "";
      const image = $('meta[property="og:image"]').attr("content") || "";
      const author =
        $('meta[name="author"]').attr("content") ||
        $('[data-testid="authorName"]').text() ||
        "";

      const publishedAt =
        $('meta[property="article:published_time"]').attr("content") ||
        $("time").attr("datetime") ||
        "";

      return {
        title: title.trim(),
        description: description.trim(),
        image: image.trim(),
        siteName: "Medium",
        author: author.trim(),
        publishedAt: publishedAt.trim(),
      };
    },
  },

  // はてなブログ
  {
    match: (url: string) =>
      url.includes("hatenablog.com") || url.includes("hatena.ne.jp"),
    extract: (url: string, $: cheerio.Root): PlatformData => {
      const title =
        $('meta[property="og:title"]').attr("content") ||
        $("h1").first().text() ||
        "";
      const description =
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        "";
      const image = $('meta[property="og:image"]').attr("content") || "";
      const author =
        $('meta[name="author"]').attr("content") ||
        $(".author-name").text() ||
        "";

      return {
        title: title.trim(),
        description: description.trim(),
        image: image.trim(),
        siteName: "はてなブログ",
        author: author.trim(),
      };
    },
  },

  // GitHub
  {
    match: (url: string) => url.includes("github.com"),
    extract: (url: string, $: cheerio.Root): PlatformData => {
      const title =
        $('meta[property="og:title"]').attr("content") ||
        $("h1").first().text() ||
        "";
      const description =
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        "";
      const image = $('meta[property="og:image"]').attr("content") || "";

      // GitHubの場合はリポジトリ情報を取得
      const repoInfo =
        $(".repository-lang-stats-graph").length > 0 ? "Repository" : "GitHub";

      return {
        title: title.trim(),
        description: description.trim(),
        image: image.trim(),
        siteName: repoInfo,
      };
    },
  },
];

/**
 * URL のメタデータを取得する
 */
async function fetchUrlMetadata(url: string) {
  try {
    console.log(`Fetching metadata for URL: ${url}`);

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "ja,en-US;q=0.7,en;q=0.3",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch URL: ${response.status} ${response.statusText}`
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // プラットフォーム別の処理を試行
    const platformHandler = platformHandlers.find((handler) =>
      handler.match(url)
    );
    let platformData: PlatformData = {};

    if (platformHandler) {
      console.log(`Using platform handler for: ${url}`);
      try {
        platformData = platformHandler.extract(url, $);
        console.log(`Platform data extracted:`, platformData);
      } catch (error) {
        console.warn(`Platform-specific extraction failed for ${url}:`, error);
      }
    }

    // 汎用的なメタデータ取得
    const getMetaContent = (name: string) => {
      return (
        $(`meta[property="${name}"]`).attr("content") ||
        $(`meta[name="${name}"]`).attr("content") ||
        ""
      );
    };

    // タイトルを取得（優先順位: プラットフォーム固有 > og:title > title タグ）
    const title =
      platformData.title ||
      getMetaContent("og:title") ||
      $("title").text() ||
      "";

    // 説明を取得（優先順位: プラットフォーム固有 > og:description > description）
    const description =
      platformData.description ||
      getMetaContent("og:description") ||
      getMetaContent("description") ||
      "";

    // 画像を取得（優先順位: プラットフォーム固有 > og:image > twitter:image）
    let image =
      platformData.image ||
      getMetaContent("og:image") ||
      getMetaContent("twitter:image") ||
      "";

    // 画像URLが相対パスの場合、絶対URLに変換
    if (image && !image.startsWith("http")) {
      try {
        const baseUrl = new URL(url);
        image = new URL(image, baseUrl.origin).href;
      } catch {
        // 無効なURLの場合は空文字列に
        image = "";
      }
    }

    // サイト名を取得
    const siteName =
      platformData.siteName || getMetaContent("og:site_name") || "";

    // URLを正規化
    const canonicalUrl =
      getMetaContent("og:url") ||
      $('link[rel="canonical"]').attr("href") ||
      url;

    // 画像URLの有効性を簡易チェック
    const validImageUrl =
      image.trim() &&
      (image.includes(".jpg") ||
        image.includes(".jpeg") ||
        image.includes(".png") ||
        image.includes(".gif") ||
        image.includes(".webp") ||
        image.includes("images/") ||
        image.includes("image/") ||
        image.includes("media/") ||
        image.includes("avatar") ||
        image.includes("thumb"))
        ? image.trim()
        : "";

    return {
      title: title.trim(),
      description: description.trim(),
      image: validImageUrl,
      siteName: siteName.trim(),
      url: canonicalUrl.trim(),
      author: platformData.author || "",
      publishedAt: platformData.publishedAt || "",
      tags: platformData.tags || [],
    };
  } catch (error) {
    console.error("Error fetching URL metadata:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : error
    );
    throw new Error(
      `URLのメタデータを取得できませんでした: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * プレビュー用メタデータ取得エンドポイント
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    console.log("Preview API called with URL:", url);

    if (!url) {
      return NextResponse.json(
        { error: "URLパラメータが必要です" },
        { status: 400 }
      );
    }

    // URLの形式を検証
    try {
      new URL(url);
    } catch (urlError) {
      console.error("Invalid URL format:", url, urlError);
      return NextResponse.json(
        { error: "有効なURLを入力してください" },
        { status: 400 }
      );
    }

    // メタデータを取得
    const metadata = await fetchUrlMetadata(url);
    console.log("Metadata fetched successfully:", metadata);

    // 最低限の情報がない場合はエラー
    if (!metadata.title && !metadata.description) {
      console.log("No title or description found for URL:", url);
      return NextResponse.json(
        { error: "プレビュー可能な情報を取得できませんでした" },
        { status: 400 }
      );
    }

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Preview API error:", error);

    // より詳細なエラー情報を返す
    const errorMessage =
      error instanceof Error ? error.message : "不明なエラーが発生しました";
    console.error("Error details:", errorMessage);

    return NextResponse.json(
      {
        error: "エラーが発生しました。もう一度お試しください。",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
