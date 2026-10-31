import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const zipPath = path.join(process.cwd(), 'public', 'pathqos-project.zip');

  if (!fs.existsSync(zipPath)) {
    return new NextResponse('Zip archive not found', { status: 404 });
  }

  const fileBuffer = fs.readFileSync(zipPath);

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="pathqos-project.zip"',
      'Content-Length': fileBuffer.length.toString(),
      'Cache-Control': 'no-cache',
    },
  });
}
