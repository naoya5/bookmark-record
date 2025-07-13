import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import * as cheerio from "cheerio";

// OpenAI APIキーの確認
if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY environment variable is not set");
}

// OpenAI クライアントの初期化
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

/**
 * URLの内容を取得して整形する
 */
async function fetchUrlContent(url: string): Promise<string> {
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

    // 不要な要素を削除
    $("script").remove();
    $("style").remove();
    $("nav").remove();
    $("header").remove();
    $("footer").remove();

    // 本文を抽出
    const content = $("main, article, .content, #content, body")
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim();

    // 内容を最大4000文字に制限
    return content.substring(0, 4000);
  } catch (error) {
    console.error("Error fetching URL content:", error);
    throw new Error("URLの内容を取得できませんでした");
  }
}

/**
 * AIによるURL内容の分析エンドポイント
 */
export async function POST(request: NextRequest) {
  try {
    const { url, question } = await request.json();

    if (!url || !question) {
      return NextResponse.json(
        { error: "URLと質問は必須です" },
        { status: 400 }
      );
    }

    // OpenAI APIキーの確認
    if (!process.env.OPENAI_API_KEY || !openai) {
      console.error("OpenAI API key is not configured");
      return NextResponse.json(
        {
          error:
            "OpenAI APIキーが設定されていません。.env.localファイルにOPENAI_API_KEYを設定してください。",
          details:
            "OpenAI APIキーは https://platform.openai.com/api-keys から取得できます。",
        },
        { status: 500 }
      );
    }

    // URLの内容を取得
    const urlContent = await fetchUrlContent(url);

    if (!urlContent) {
      return NextResponse.json(
        { error: "URLから有効な内容を取得できませんでした" },
        { status: 400 }
      );
    }

    // OpenAI APIで質問に回答
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "あなたは親切で知識豊富なアシスタントです。与えられたWebページの内容に基づいて、ユーザーの質問に日本語で回答してください。",
        },
        {
          role: "user",
          content: `以下のWebページの内容について質問があります。

Webページの内容:
${urlContent}

質問: ${question}

上記の内容に基づいて、質問に回答してください。`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const answer =
      completion.choices[0]?.message?.content || "回答を生成できませんでした";

    return NextResponse.json({
      answer,
      urlContent: urlContent.substring(0, 500) + "...", // プレビュー用に短縮
    });
  } catch (error) {
    console.error("AI analysis error:", error);
    return NextResponse.json(
      { error: "エラーが発生しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}
