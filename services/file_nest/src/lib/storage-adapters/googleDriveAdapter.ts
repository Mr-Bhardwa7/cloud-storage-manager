import type { StorageAdapter } from './base';
import type { FileItem } from '@/types/file';
import { google, drive_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

interface GoogleDriveAdapterConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken: string;
}

export class GoogleDriveStorageAdapter implements StorageAdapter {
  private oauth2Client: OAuth2Client;
  private drive: drive_v3.Drive;
  
  constructor(config: GoogleDriveAdapterConfig) {
    this.oauth2Client = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      config.redirectUri
    );
    
    this.oauth2Client.setCredentials({
      refresh_token: config.refreshToken
    });
    
    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
  }
  
  async list(dirPath: string): Promise<FileItem[]> {
    try {
      // Get folder ID from path
      const folderId = await this.getFolderIdFromPath(dirPath);
      
      // Query files in the folder
      const query = folderId === 'root' 
        ? `'root' in parents and trashed = false`
        : `'${folderId}' in parents and trashed = false`;
      
      const response = await this.drive.files.list({
        q: query,
        fields: 'files(id, name, mimeType, modifiedTime, size)',
        pageSize: 1000,
      });
      
      // Convert Google Drive files to FileItem format
      return (response.data.files || []).map(file => ({
        name: file.name || 'Unnamed',
        path: `${dirPath}/${file.name}`,
        type: file.mimeType === 'application/vnd.google-apps.folder' ? 'folder' : 'file',
        size: parseInt(file.size || '0'),
        modified: file.modifiedTime || new Date().toISOString(),
        extension: this.getFileExtension(file.name || '', file.mimeType || ''),
        id: file.id || ''
      }));
    } catch (error) {
      console.error('Error listing files from Google Drive:', error);
      throw new Error('Failed to list files from Google Drive');
    }
  }
  
  async upload(file: File, filePath: string): Promise<void> {
    try {
      // Extract directory path and filename
      const lastSlashIndex = filePath.lastIndexOf('/');
      const dirPath = lastSlashIndex > 0 ? filePath.substring(0, lastSlashIndex) : '';
      const fileName = lastSlashIndex > 0 ? filePath.substring(lastSlashIndex + 1) : filePath;
      
      // Get parent folder ID
      const folderId = await this.getFolderIdFromPath(dirPath);
      
      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Upload file to Google Drive
      await this.drive.files.create({
        requestBody: {
          name: fileName,
          parents: [folderId]
        },
        media: {
          body: buffer,
          mimeType: file.type
        }
      });
    } catch (error) {
      console.error('Error uploading file to Google Drive:', error);
      throw new Error('Failed to upload file to Google Drive');
    }
  }
  
  async delete(filePath: string): Promise<void> {
    try {
      const fileId = await this.getFileIdFromPath(filePath);
      await this.drive.files.delete({ fileId });
    } catch (error) {
      console.error('Error deleting file from Google Drive:', error);
      throw new Error('Failed to delete file from Google Drive');
    }
  }
  
  async move(sourcePath: string, destinationPath: string): Promise<void> {
    try {
      const fileId = await this.getFileIdFromPath(sourcePath);
      
      const lastSlashIndex = destinationPath.lastIndexOf('/');
      const destDirPath = lastSlashIndex > 0 ? destinationPath.substring(0, lastSlashIndex) : '';
      const newFileName = lastSlashIndex > 0 ? destinationPath.substring(lastSlashIndex + 1) : destinationPath;
      
      const destFolderId = await this.getFolderIdFromPath(destDirPath);
      
      // Get current parents
      const file = await this.drive.files.get({
        fileId,
        fields: 'parents'
      });

      // Move the file to the new folder
      await this.drive.files.update({
        fileId,
        addParents: destFolderId,
        removeParents: file.data.parents?.join(','),
        requestBody: {
          name: newFileName
        }
      });
    } catch (error) {
      console.error('Error moving file in Google Drive:', error);
      throw new Error('Failed to move file in Google Drive');
    }
  }
  
  async copy(sourcePath: string, destinationPath: string): Promise<void> {
    try {
      // Get file ID and destination folder ID
      const fileId = await this.getFileIdFromPath(sourcePath);
      
      const lastSlashIndex = destinationPath.lastIndexOf('/');
      const destDirPath = lastSlashIndex > 0 ? destinationPath.substring(0, lastSlashIndex) : '';
      const newFileName = lastSlashIndex > 0 ? destinationPath.substring(lastSlashIndex + 1) : destinationPath;
      
      const destFolderId = await this.getFolderIdFromPath(destDirPath);
      
      // Copy the file to the new location
      await this.drive.files.copy({
        fileId,
        requestBody: {
          name: newFileName,
          parents: [destFolderId]
        }
      });
    } catch (error) {
      console.error('Error copying file in Google Drive:', error);
      throw new Error('Failed to copy file in Google Drive');
    }
  }
  
  async createFolder(folderPath: string): Promise<void> {
    try {
      // Extract parent directory path and folder name
      const lastSlashIndex = folderPath.lastIndexOf('/');
      const parentPath = lastSlashIndex > 0 ? folderPath.substring(0, lastSlashIndex) : '';
      const folderName = lastSlashIndex > 0 ? folderPath.substring(lastSlashIndex + 1) : folderPath;
      
      // Get parent folder ID
      const parentId = await this.getFolderIdFromPath(parentPath);
      
      // Create folder
      await this.drive.files.create({
        requestBody: {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [parentId]
        }
      });
    } catch (error) {
      console.error('Error creating folder in Google Drive:', error);
      throw new Error('Failed to create folder in Google Drive');
    }
  }
  
  async getDownloadUrl(filePath: string): Promise<string> {
    try {
      const fileId = await this.getFileIdFromPath(filePath);
      
      // For Google Docs, Sheets, etc., we need to export them
      const file = await this.drive.files.get({
        fileId,
        fields: 'mimeType,name'
      });
      
      if (file.data.mimeType?.startsWith('application/vnd.google-apps')) {
        // This is a Google Workspace file, we need to export it
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
      } else {
        // Regular file, we can download directly
        return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&access_token=${
          (await this.oauth2Client.getAccessToken()).token
        }`;
      }
    } catch (error) {
      console.error('Error generating download URL for Google Drive file:', error);
      throw new Error('Failed to generate download URL for Google Drive file');
    }
  }
  
  // Helper methods
  private async getFolderIdFromPath(dirPath: string): Promise<string> {
    if (!dirPath || dirPath === '/' || dirPath === '') {
      return 'root';
    }
    
    // Split path into components
    const pathComponents = dirPath.split('/').filter(Boolean);
    let currentFolderId = 'root';
    
    // Traverse the path to find the final folder ID
    for (const component of pathComponents) {
      const query = `'${currentFolderId}' in parents and name = '${component}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
      
      const response = await this.drive.files.list({
        q: query,
        fields: 'files(id)',
        pageSize: 1
      });
      
      if (!response.data.files || response.data.files.length === 0) {
        // Folder doesn't exist, create it
        const newFolder = await this.drive.files.create({
          requestBody: {
            name: component,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [currentFolderId]
          },
          fields: 'id'
        });
        
        currentFolderId = newFolder.data.id || 'root';
      } else {
        currentFolderId = response.data.files[0].id || 'root';
      }
    }
    
    return currentFolderId;
  }
  
  private async getFileIdFromPath(filePath: string): Promise<string> {
    // Extract directory path and filename
    const lastSlashIndex = filePath.lastIndexOf('/');
    const dirPath = lastSlashIndex > 0 ? filePath.substring(0, lastSlashIndex) : '';
    const fileName = lastSlashIndex > 0 ? filePath.substring(lastSlashIndex + 1) : filePath;
    
    // Get parent folder ID
    const folderId = await this.getFolderIdFromPath(dirPath);
    
    // Find file in the folder
    const query = `'${folderId}' in parents and name = '${fileName}' and trashed = false`;
    
    const response = await this.drive.files.list({
      q: query,
      fields: 'files(id)',
      pageSize: 1
    });
    
    if (!response.data.files || response.data.files.length === 0) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    return response.data.files[0].id || '';
  }
  
  private getFileExtension(fileName: string, mimeType: string): string | undefined {
    // Extract extension from filename
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex > 0) {
      return fileName.substring(lastDotIndex + 1);
    }
    
    // If no extension in filename, try to determine from MIME type
    const mimeToExtension: Record<string, string> = {
      'text/plain': 'txt',
      'text/html': 'html',
      'text/css': 'css',
      'text/javascript': 'js',
      'application/json': 'json',
      'application/pdf': 'pdf',
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/gif': 'gif',
      'application/vnd.google-apps.document': 'gdoc',
      'application/vnd.google-apps.spreadsheet': 'gsheet',
      'application/vnd.google-apps.presentation': 'gslides',
      'application/vnd.google-apps.form': 'gform',
      'application/vnd.google-apps.drawing': 'gdraw'
    };
    
    return mimeToExtension[mimeType];
  }
}