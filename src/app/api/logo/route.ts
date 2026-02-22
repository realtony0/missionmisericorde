import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "logo.png");
  try {
    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'attachment; filename="logo-mission-misericorde.png"',
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
