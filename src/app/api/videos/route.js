export async function DELETE(request) {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    const { id } = await request.json();
    await client.query("DELETE FROM videos WHERE id = $1", [id]);
    await client.end();
    return NextResponse.json({ success: true });
  } catch (error) {
    await client.end();
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { Client } from "pg";

const connectionString = process.env.POSTGRES_CONNECTION_STRING;

export async function POST(request) {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    const data = await request.json();
    const { url, description } = data;
    const result = await client.query(
      "INSERT INTO videos (url, description) VALUES ($1, $2) RETURNING *",
      [url, description]
    );
    await client.end();
    return NextResponse.json({ success: true, video: result.rows[0] });
  } catch (error) {
    await client.end();
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    const result = await client.query(
      "SELECT * FROM videos ORDER BY uploaded_at DESC"
    );
    await client.end();
    return NextResponse.json({ success: true, videos: result.rows });
  } catch (error) {
    await client.end();
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
