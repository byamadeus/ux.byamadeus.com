import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in dev" }, { status: 403 });
  }

  const { file, sections } = await req.json();
  if (!file || !Array.isArray(sections)) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "content", `${file}.json`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const json = JSON.parse(raw);
  json.sections = sections;
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + "\n", "utf-8");

  return NextResponse.json({ ok: true });
}
