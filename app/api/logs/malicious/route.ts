import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

export async function GET() {
  const filePath = path.join(process.cwd(), "logs", "malicious_events.csv");

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "malicious_events.csv not found" }, { status: 404 });
  }

  const results: any[] = [];

  // Convert the CSV stream into an awaited promise
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve())
      .on("error", (err) => reject(err));
  });

  return NextResponse.json(results);
}
