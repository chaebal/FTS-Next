import sqlite3 from "better-sqlite3";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const dbPath = path.resolve(
  "/Users/adam/Documents/fts-backend/futsal_account_db.db"
);
const db = sqlite3(dbPath);

interface user {
  email: string;
  username: string;
  password: string;
  player_id: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    // const player_id = searchParams.get("player_id");
    const username = searchParams.get("username");
    const password = searchParams.get("password");

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and Password are required" },
        { status: 400 }
      );
    }

    const query = `SELECT * from Users Where username = ? AND password = ?`;
    const stmt = db.prepare(query);
    const result = stmt.get(username, password);

    if (result) {
      return NextResponse.json({ success: true, data: result });
    } else {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse request body to JSON
    console.log("Request Body:", body); // Log the body to check if we are receiving the correct data

    const { email, username, password } = body;
    // const { username, password } = body;

    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const player_id = uuidv4();

    db.prepare(
      `
        INSERT INTO users (player_id, username, password, email)
        VALUES (?, ?, ?, ?)
    `
    ).run(player_id, username, password, email);

    return NextResponse.json(
      { message: "Registration successfull." },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error");
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Parse request parameters from the URL or the body
    const { searchParams } = new URL(req.url);
    const player_id = searchParams.get("player_id");
    const session_no = searchParams.get("session_no");

    if (!player_id) {
      return new Response(
        JSON.stringify({ error: "Player ID is required for deletion" }),
        { status: 400 }
      );
    }

    if (!session_no) {
      return new Response(
        JSON.stringify({ error: "Session No is not found" }),
        { status: 400 }
      );
    }

    db.prepare(
      `
        DELETE FROM PlayerMetrics WHERE player_id = ? AND session_no = ?
    `
    ).run(player_id, session_no);

    const remainingRow = db
      .prepare(
        `SELECT * FROM PlayerMetrics WHERE player_id = ? AND session_no = ?`
      )
      .get(player_id, session_no);

    // Check if any row was deleted
    if (!remainingRow) {
      db.prepare(
        `
      UPDATE PlayerMetrics
SET session_no = session_no - 1
WHERE player_id = ? AND session_no > ?
    `
      ).run(player_id, session_no);
      return new Response(
        JSON.stringify({
          message: "Record deleted successfully and session has been reordered",
          deletedRecord: remainingRow,
        }),
        { status: 200 }
      );
    }

    // Return success response
  } catch (error) {
    // Return error response
    return new Response(
      JSON.stringify({
        error: "An error occurred while deleting the record",
      }),
      { status: 500 }
    );
  }
}
