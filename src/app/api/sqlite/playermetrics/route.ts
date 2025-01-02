import sqlite3 from "better-sqlite3";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const dbPath = path.resolve("/Users/adam/Documents/fts-backend/futsal_db.db");
const db = sqlite3(dbPath);

interface stats {
  player_id: number;
  training_id: number;
  speed: number;
  distance: number;
  time: number;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const player_id = searchParams.get("player_id");

    if (!player_id) {
      return NextResponse.json(
        { error: "Player ID required" },
        { status: 400 }
      );
    }

    const query = "SELECT * FROM PlayerMetrics WHERE player_id = ?";
    const metrics = db.prepare(query).all(Number(player_id));

    return NextResponse.json({ metrics });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse request body to JSON
    const { player_id, training_id, speed, distance, time } = body;

    if (!player_id || !training_id || !speed || !distance || !time) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    db.prepare(
      `
        INSERT INTO PlayerMetrics (player_id, training_id, speed, distance, time)
        VALUES (?, ?, ?, ?, ?)
    `
    ).run(player_id, training_id, speed, distance, time);

    return NextResponse.json(
      { message: "Player metrics updated successfully." },
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
