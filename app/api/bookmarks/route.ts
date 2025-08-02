import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 特定トピックのブックマーク一覧を取得する
 *
 * @param request - リクエストオブジェクト（topicIdクエリパラメータを含む）
 * @returns ブックマーク一覧（作成日時の降順）
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get("topicId");

    if (!topicId) {
      return NextResponse.json(
        { error: "Topic ID is required" },
        { status: 400 }
      );
    }

    // 指定されたトピックのブックマークを新しい順で取得
    const bookmarks = await prisma.bookmark.findMany({
      where: { topicId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

/**
 * 新しいブックマークを作成する
 *
 * @param request - リクエストオブジェクト（url, description, topicIdを含む）
 * @returns 作成されたブックマーク情報
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, description, topicId } = body;

    //validate url and topicId
    if (!url || !topicId) {
      return NextResponse.json(
        { error: "URL and topicId are required" },
        { status: 400 }
      );
    }

    // URLの形式が正しいかを検証（不正なURLの場合はエラーを返す）
    try {
      const parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return NextResponse.json(
          { error: "Only HTTP/HTTPS URLs are allowed" },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    //bookmark create
    const bookmark = await prisma.bookmark.create({
      data: {
        url,
        description: description || null,
        topicId,
      },
    });

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 }
    );
  }
}
/**
 * 複数のブックマークを一括で作成する
 *
 * @param request - リクエストオブジェクト（url, description, topicIdを含む）
 * @returns 作成されたブックマーク情報
 */
export async function POST(request: NextRequest){
  //TODO: URLのバリデーションとURLの分割
  try{
    const body = await request.json();
    const {urls, description, topicId} = body;
  }
}