import { NextResponse } from 'next/server';
import { GoogleDriveService } from '@/providers/googleDriveService';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost/account';

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  const service = new GoogleDriveService();
  try {
    await service.connectAccount(code);
    return NextResponse.redirect(`${baseUrl}/dashboard?connected=google-drive`);
  } catch (error) {
    console.error('Google Drive connection failed:', error);
    return NextResponse.redirect(`${baseUrl}/error?reason=google-drive-failed`);
  }
}
