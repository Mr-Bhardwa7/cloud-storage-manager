import type { FileItem } from '@/types/file';

export interface StorageAdapter {
  list(path: string): Promise<FileItem[]>;
  upload(file: File, path: string): Promise<void>;
  delete(path: string): Promise<void>;
  move(source: string, destination: string): Promise<void>;
  copy(source: string, destination: string): Promise<void>;
  createFolder(path: string): Promise<void>;
  getDownloadUrl(path: string): Promise<string>;
}