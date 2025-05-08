export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'folder';
  size?: number;
  modified?: string;
  extension?: string;
  id?: string;
}
