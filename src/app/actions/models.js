"use server";

import { query, queryOne } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getModels() {
  try {
    const result = await query(
      "SELECT * FROM models ORDER BY uploaded_at DESC"
    );
    return { success: true, models: result.rows };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function createModel(formData) {
  try {
    const url = formData.get("url");
    const description = formData.get("description");

    const model = await queryOne(
      "INSERT INTO models (url, description) VALUES ($1, $2) RETURNING *",
      [url, description]
    );

    revalidatePath("/models");
    return { success: true, model };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteModel(id) {
  try {
    await query("DELETE FROM models WHERE id = $1", [id]);
    revalidatePath("/models");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
