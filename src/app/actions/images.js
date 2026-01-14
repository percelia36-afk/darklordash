"use server";

import { query, queryOne } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getImages() {
  try {
    const result = await query(
      "SELECT * FROM images ORDER BY uploaded_at DESC"
    );
    return { success: true, images: result.rows };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function createImage(formData) {
  try {
    const url = formData.get("url");
    const description = formData.get("description");

    const image = await queryOne(
      "INSERT INTO images (url, description) VALUES ($1, $2) RETURNING *",
      [url, description]
    );

    revalidatePath("/images");
    return { success: true, image };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteImage(id) {
  try {
    await query("DELETE FROM images WHERE id = $1", [id]);
    revalidatePath("/images");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
