import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in dev" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const dest = formData.get("dest") as string | null; // e.g. "images/cards/echo"

  if (!file || !dest) {
    return NextResponse.json({ error: "Missing file or dest" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const outPath = path.join(process.cwd(), "public", `${dest}.webp`);
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  await sharp(buffer).webp({ quality: 85 }).toFile(outPath);

  return NextResponse.json({ src: `/${dest}.webp` });
}
