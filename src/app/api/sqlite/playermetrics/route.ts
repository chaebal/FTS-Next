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
