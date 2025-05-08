import { NextResponse } from 'next/server';
import { GoogleDriveService } from '@/providers/googleDriveService'; 

export async function GET() {
  const url = GoogleDriveService.getAuthUrl();
  return NextResponse.json({ url });
}