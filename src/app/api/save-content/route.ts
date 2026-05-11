import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function setNestedValue(obj: Record<string, unknown>, dotPath: string, value: unknown) {
  const keys = dotPath.split(".");
  let cur: Record<string, unknown> = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (cur[k] === undefined || cur[k] === null) cur[k] = {};
    cur = cur[k] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in dev" }, { status: 403 });
  }

  const { file, path: dotPath, value } = await req.json();
  if (!file || !dotPath || value === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "content", `${file}.json`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const json = JSON.parse(raw);
  setNestedValue(json, dotPath, value);
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + "\n", "utf-8");

  return NextResponse.json({ ok: true });
}
