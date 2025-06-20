import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { Video as Interfacevideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";

const getImageKitThumbnail = (videoUrl: string) => {
  try {
    if (!videoUrl || typeof videoUrl !== "string") return "";

    const url = new URL(videoUrl);

    const thumbnailPath = url.pathname.endsWith(".jpg")
      ? url.pathname
      : `${url.pathname}/ik-thumbnail.jpg`;

    const searchParams = new URLSearchParams();

    const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".flv"];
    const isVideo = videoExtensions.some((ext) =>
      url.pathname.toLowerCase().endsWith(ext)
    );

    if (isVideo) {
      searchParams.set("tr", "so-5,w-400,h-225");
    } else {
      searchParams.set("tr", "w-400,h-225");
    }

    return `${url.origin}${thumbnailPath}?${searchParams.toString()}`;
  } catch (error) {
    console.error("Error generating ImageKit thumbnail:", error);
    return "";
  }
};

// GET: Fetch all videos
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const videos = await Video.find({})
      .sort({ createdAt: -1 })
      .populate("userId", "email")
      .lean();

    return NextResponse.json(videos || []);
  } catch (error) {
    console.error("Error in VideoRoute::Failed to fetch videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

// POST: Upload and Save a new video
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const body: Interfacevideo = await request.json();

    if (!body.title || !body.description || !body.videoUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const autoThumbnailUrl = getImageKitThumbnail(body.videoUrl);

    const videoData = {
      ...body,
      userId: session.user.id,
      thumbnailUrl: autoThumbnailUrl,
      controls: body?.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100,
      },
    };

    const newVideo = await Video.create(videoData);

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error("Error in VideoRoute::Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
