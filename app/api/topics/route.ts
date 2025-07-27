import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/lib/generated/prisma";

/**
 * 全てのトピック一覧を取得する
 *
 * @returns トピック一覧（ブックマーク数を含む、更新日時の降順）
 */
export async function GET() {
  try {
    const topics = await prisma.topic.findMany({
      include: {
        _count: {
          select: { bookmarks: true },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // レスポンス用にブックマーク数を追加（フロントエンドで使いやすい形式に変換）
    const topicsWithCount = topics.map(
      (
        topic: Prisma.TopicGetPayload<{
          include: { _count: { select: { bookmarks: true } } };
        }>
      ) => ({
        ...topic,
        bookmarkCount: topic._count.bookmarks,
      })
    );

    return NextResponse.json(topicsWithCount);

    // エラーが発生した場合はエラーレスポンスを返す
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch topics",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * 新しいトピックを作成する
 *
 * @param request - リクエストオブジェクト（title, description, emojiを含む）
 * @returns 作成されたトピック情報（ブックマーク数を含む）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, emoji } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // タイトルの重複チェック
    const existingTopic = await prisma.topic.findFirst({
      where: {
        title: {
          equals: title,
          mode: "insensitive",
        },
      },
    });

    if (existingTopic) {
      return NextResponse.json(
        { error: "Topic with this title already exists" },
        { status: 409 }
      );
    }

    // トピックを作成
    const topic = await prisma.topic.create({
      data: {
        title,
        description: description || null,
        emoji: emoji || "📁",
      },
      include: {
        _count: {
          select: { bookmarks: true },
        },
      },
    });

    // レスポンス用にブックマーク数を追加
    const topicWithCount = {
      ...topic,
      bookmarkCount: topic._count.bookmarks,
    };

    return NextResponse.json(topicWithCount, { status: 201 });
  } catch (error) {
    console.error("Error creating topic:", error);
    return NextResponse.json(
      { error: "Failed to create topic" },
      { status: 500 }
    );
  }
}
