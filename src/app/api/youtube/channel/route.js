import { NextResponse } from "next/server";
import { Client } from "pg";
export async function POST(request) {
  // Parse the incoming JSON body
  const body = await request.json();
  console.log("POST handler called");

  // Transform YouTube video data to match the videos table schema
  const videoId = body.id?.videoId;
  const url = videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;
  const uploaded_at = body.snippet?.publishedAt || null;
  const thumbnail_url = body.snippet?.thumbnails?.high?.url || null;
  // You can set game_title and playlist_url to null or extract if available
  const game_title = null;
  const playlist_url = null;

  const videoPayload = {
    url,
    game_title,
    uploaded_at,
    playlist_url,
    thumbnail_url,
  };
  console.log("Video payload:", videoPayload);

  // Insert into PostgreSQL using pg
  const client = new Client({
    connectionString: process.env.POSTGRES_CONNECTION_STRING,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    console.log("Connected to database");
    const result = await client.query(
      "INSERT INTO videos (url, game_title, uploaded_at, playlist_url, thumbnail_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        videoPayload.url,
        videoPayload.game_title,
        videoPayload.uploaded_at,
        videoPayload.playlist_url,
        videoPayload.thumbnail_url,
      ]
    );
    console.log("Insert result:", result.rows[0]);
    await client.end();
    return NextResponse.json({ status: "success", data: result.rows[0] });
  } catch (error) {
    await client.end();
    console.error("Database error:", error);
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const channelId =
    searchParams.get("channelId") || process.env.YOUTUBE_CHANNEL_ID;
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "YouTube API key not configured" },
      { status: 500 }
    );
  }
  if (!channelId) {
    return NextResponse.json(
      { error: "Channel ID is required and not set in environment variables" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=1&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: "No videos found for this channel" },
        { status: 404 }
      );
    }

    // Extract and transform the video data
    const video = data.items[0];
    const videoId = video.id?.videoId;
    const url = videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;
    const uploaded_at = video.snippet?.publishedAt || null;
    const thumbnail_url = video.snippet?.thumbnails?.high?.url || null;
    const game_title = null;
    const playlist_url = null;

    const videoPayload = {
      url,
      game_title,
      uploaded_at,
      playlist_url,
      thumbnail_url,
    };

    // Insert into PostgreSQL using pg (directly, not via HTTP)
    const { Client } = await import("pg");
    const client = new Client({
      connectionString: process.env.POSTGRES_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false },
    });
    let dbResult = null;
    try {
      await client.connect();
      const result = await client.query(
        "INSERT INTO videos (url, game_title, uploaded_at, playlist_url, thumbnail_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [
          videoPayload.url,
          videoPayload.game_title,
          videoPayload.uploaded_at,
          videoPayload.playlist_url,
          videoPayload.thumbnail_url,
        ]
      );
      dbResult = result.rows[0];
      await client.end();
    } catch (err) {
      dbResult = { error: true, message: err.message };
      await client.end();
    }

    return NextResponse.json({ videoPayload, youtube: video, dbResult });
  } catch (error) {
    console.error("Error fetching YouTube channel:", error);
    return NextResponse.json(
      { error: "Failed to fetch channel data" },
      { status: 500 }
    );
  }
}
