import type { StorageAdapter } from './base';
import type { FileItem } from '@/types/file';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';

/**
 * A storage adapter that uses the local file system
 * Note: This is for development/testing only and won't work in production
 * environments like Vercel where the filesystem is read-only
 */
export class LocalStorageAdapter implements StorageAdapter {
  private basePath: string;
  
  constructor() {
    // Use a directory in the OS temp directory for development
    this.basePath = process.env.LOCAL_STORAGE_PATH || 
      path.join(os.tmpdir(), 'filenest-storage');
    
    // Ensure the base directory exists
    this.ensureBaseDirectory();
  }
  
  private async ensureBaseDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.basePath, { recursive: true });
    } catch (error) {
      console.error('Failed to create base directory:', error);
    }
  }
  
  // Make this method public so it can be accessed in the download route
  public resolvePath(filePath: string): string {
    // Normalize the path and ensure it's within the base path
    const normalizedPath = path.normalize(filePath).replace(/^\/+/, '');
    return path.join(this.basePath, normalizedPath);
  }
  
  async list(dirPath: string): Promise<FileItem[]> {
    const fullPath = this.resolvePath(dirPath);
    
    try {
      const entries = await fs.readdir(fullPath, { withFileTypes: true });
      
      const fileItems: FileItem[] = await Promise.all(
        entries.map(async (entry) => {
          const entryPath = path.join(dirPath, entry.name);
          const fullEntryPath = this.resolvePath(entryPath);
          const stats = await fs.stat(fullEntryPath);
          
          return {
            name: entry.name,
            path: entryPath,
            type: entry.isDirectory() ? 'folder' : 'file',
            size: stats.size,
            modified: stats.mtime.toISOString(),
            extension: entry.isFile() ? path.extname(entry.name).slice(1) : undefined
          };
        })
      );
      
      return fileItems;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // Directory doesn't exist, return empty array
        return [];
      }
      throw error;
    }
  }
  
  async upload(file: File, filePath: string): Promise<void> {
    // In a server environment, File objects need to be handled differently
    // This is a simplified version for the concept
    const fullPath = this.resolvePath(filePath);
    const dirPath = path.dirname(fullPath);
    
    // Ensure directory exists
    await fs.mkdir(dirPath, { recursive: true });
    
    // In a real implementation, you'd handle the file upload differently
    // This is just a placeholder
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(fullPath, buffer);
  }
  
  async delete(filePath: string): Promise<void> {
    const fullPath = this.resolvePath(filePath);
    const stats = await fs.stat(fullPath);
    
    if (stats.isDirectory()) {
      await fs.rm(fullPath, { recursive: true });
    } else {
      await fs.unlink(fullPath);
    }
  }
  
  async move(sourcePath: string, destinationPath: string): Promise<void> {
    const fullSourcePath = this.resolvePath(sourcePath);
    const fullDestPath = this.resolvePath(destinationPath);
    
    // Ensure destination directory exists
    const destDir = path.dirname(fullDestPath);
    await fs.mkdir(destDir, { recursive: true });
    
    await fs.rename(fullSourcePath, fullDestPath);
  }
  
  async copy(sourcePath: string, destinationPath: string): Promise<void> {
    const fullSourcePath = this.resolvePath(sourcePath);
    const fullDestPath = this.resolvePath(destinationPath);
    
    // Ensure destination directory exists
    const destDir = path.dirname(fullDestPath);
    await fs.mkdir(destDir, { recursive: true });
    
    const stats = await fs.stat(fullSourcePath);
    
    if (stats.isDirectory()) {
      // Copy directory recursively
      await fs.cp(fullSourcePath, fullDestPath, { recursive: true });
    } else {
      // Copy file
      await fs.copyFile(fullSourcePath, fullDestPath);
    }
  }
  
  async createFolder(folderPath: string): Promise<void> {
    const fullPath = this.resolvePath(folderPath);
    await fs.mkdir(fullPath, { recursive: true });
  }
  
  async getDownloadUrl(filePath: string): Promise<string> {
    // For local development, we can just return a URL to our API
    return `/api/filemanager/download?path=${encodeURIComponent(filePath)}`;
  }
}

