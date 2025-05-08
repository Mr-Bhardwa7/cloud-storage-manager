import { NextRequest, NextResponse } from 'next/server';
import { getStorageAdapter } from '@/lib/storage-adapters';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path') || '/';
  
  try {
    const adapter = getStorageAdapter();
    const files = await adapter.list(path);
    return NextResponse.json({ files });
  } catch (err) { 
    return NextResponse.json(
      { error: 'Failed to list files', err },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { operation, path, name, sourcePath, targetPath } = await request.json();
  
  try {
    const adapter = getStorageAdapter();
    
    switch (operation) {
      case 'createFolder':
        await adapter.createFolder(`${path}/${name}`);
        break;
      case 'rename':
        // Implementation depends on adapter specifics
        break;
      case 'delete':
        await adapter.delete(path);
        break;
      case 'move':
        await adapter.move(sourcePath, targetPath);
        break;
      case 'copy':
        await adapter.copy(sourcePath, targetPath);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid operation' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({ success: true });
  } catch (err) { 
    console.error('Operation failed:', err);
    return new Response(JSON.stringify({ error: 'Operation failed' }), {
      status: 500
    });
  }
}