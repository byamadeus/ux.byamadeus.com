import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in dev" }, { status: 403 });
  }

  const cwd = process.cwd();

  try {
    await execAsync('git add content/ public/images/', { cwd });
    const { stdout: diffOut } = await execAsync('git diff --cached --name-only', { cwd });
    if (!diffOut.trim()) {
      return NextResponse.json({ ok: true, message: "Nothing to commit" });
    }
    await execAsync('git commit -m "content: update via web builder"', { cwd });
    await execAsync('git push', { cwd });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
