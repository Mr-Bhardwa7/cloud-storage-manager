import { NextRequest, NextResponse } from 'next/server';
import { getStorageAdapter } from '@/lib/storage-adapters';
import { LocalStorageAdapter } from '@/lib/storage-adapters/localAdapter';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filePath = searchParams.get('path');
  
  if (!filePath) {
    return NextResponse.json(
      { error: 'Path parameter is required' },
      { status: 400 }
    );
  }
  
  try {
    const adapter = getStorageAdapter();
    
    // For cloud storage adapters, we might redirect to a signed URL
    // For local adapter, we need to read the file and return it
    if (adapter instanceof LocalStorageAdapter) {
      // This is a simplified example for local development
      const localAdapter = adapter as LocalStorageAdapter;
      const fullPath = localAdapter.resolvePath(filePath);
      const fileBuffer = await fs.readFile(fullPath);
      const fileName = path.basename(filePath);
      
      // Determine content type based on file extension
      const ext = path.extname(fileName).toLowerCase();
      let contentType = 'application/octet-stream'; // Default
      
      // Map common extensions to content types
      const contentTypeMap: Record<string, string> = {
        '.txt': 'text/plain',
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      };
      
      if (ext in contentTypeMap) {
        contentType = contentTypeMap[ext];
      }
      
      // Return the file with appropriate headers
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      });
    } else {
      // For cloud storage, redirect to the download URL
      const downloadUrl = await adapter.getDownloadUrl(filePath);
      return NextResponse.redirect(downloadUrl);
    }
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }
}

