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
    const description = formData.get("description");

    const video = await queryOne(
      "INSERT INTO videos (url, description) VALUES ($1, $2) RETURNING *",
      [url, description]
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
