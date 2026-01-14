"use server";

import { query, queryOne } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getVideos() {
  try {
    const result = await query(
      "SELECT * FROM videos ORDER BY uploaded_at DESC"
    );
    return { success: true, videos: result.rows };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function createVideo(formData) {
  try {
    const url = formData.get("url");
    const game_title = formData.get("game_title");
    const playlist_url = formData.get("playlist_url");
    const thumbnail_url = formData.get("thumbnail_url");

    const video = await queryOne(
      "INSERT INTO videos (url, game_title, playlist_url, thumbnail_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [url, game_title, playlist_url, thumbnail_url]
    );

    revalidatePath("/videos");
    return { success: true, video };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteVideo(id) {
  try {
    await query("DELETE FROM videos WHERE id = $1", [id]);
    revalidatePath("/videos");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
