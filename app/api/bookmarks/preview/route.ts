import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

/**
 * URL のメタデータを取得する
 */
async function fetchUrlMetadata(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Open Graph タグを取得
    const getMetaContent = (name: string) => {
      return (
        $(`meta[property="${name}"]`).attr("content") ||
        $(`meta[name="${name}"]`).attr("content") ||
        ""
      );
    };

    // タイトルを取得（優先順位: og:title > title タグ）
    const title = getMetaContent("og:title") || $("title").text() || "";

    // 説明を取得（優先順位: og:description > description）
    const description =
      getMetaContent("og:description") ||
      getMetaContent("description") ||
      "";

    // 画像を取得（優先順位: og:image > twitter:image）
    const image =
      getMetaContent("og:image") ||
      getMetaContent("twitter:image") ||
      "";

    // サイト名を取得
    const siteName = getMetaContent("og:site_name") || "";

    // URLを正規化
    const canonicalUrl = 
      getMetaContent("og:url") ||
      $('link[rel="canonical"]').attr("href") ||
      url;

    return {
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      siteName: siteName.trim(),
      url: canonicalUrl.trim(),
    };
  } catch (error) {
    console.error("Error fetching URL metadata:", error);
    throw new Error("URLのメタデータを取得できませんでした");
  }
}

/**
 * プレビュー用メタデータ取得エンドポイント
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URLパラメータが必要です" },
        { status: 400 }
      );
    }

    // URLの形式を検証
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "有効なURLを入力してください" },
        { status: 400 }
      );
    }

    // メタデータを取得
    const metadata = await fetchUrlMetadata(url);

    // 最低限の情報がない場合はエラー
    if (!metadata.title && !metadata.description) {
      return NextResponse.json(
        { error: "プレビュー可能な情報を取得できませんでした" },
        { status: 400 }
      );
    }

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Preview API error:", error);
    return NextResponse.json(
      { error: "エラーが発生しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}