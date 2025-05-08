import { NextRequest, NextResponse } from 'next/server';
import { getStorageAdapter } from '@/lib/storage-adapters';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;
    
    if (!file || !path) {
      return NextResponse.json(
        { error: 'File and path are required' },
        { status: 400 }
      );
    }
    
    const adapter = getStorageAdapter();
    await adapter.upload(file, `${path}/${file.name}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Configure the route to handle larger file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};