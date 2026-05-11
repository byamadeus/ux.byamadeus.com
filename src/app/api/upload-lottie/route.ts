import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in dev" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  // Validate it's JSON
  if (!file.name.endsWith(".json")) {
    return NextResponse.json({ error: "Must be a .json file" }, { status: 400 });
  }

  const text = await file.text();
  try {
    JSON.parse(text); // validate parseable
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
  const outPath = path.join(process.cwd(), "public", "lottie", safeName);
  const outDir = path.dirname(outPath);

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, text, "utf-8");

  return NextResponse.json({ path: `/lottie/${safeName}` });
}
