import { StorageAdapter } from './base';
import { LocalStorageAdapter } from './localAdapter';
import { GoogleDriveStorageAdapter } from './googleDriveAdapter';
// Import other adapters as needed
// import { S3StorageAdapter } from './awsS3Adapter';
// import { AzureBlobStorageAdapter } from './azureBlobAdapter';

/**
 * Factory function to get the appropriate storage adapter based on environment configuration
 */
export function getStorageAdapter(): StorageAdapter {
  // Get the storage type from environment variables
  const storageType = process.env.STORAGE_TYPE || 'local';
  
  // Return the appropriate adapter based on the storage type
  switch (storageType.toLowerCase()) {
    case 's3':
    case 'aws':
    case 'aws-s3':
      // return new S3StorageAdapter({
      //   region: process.env.AWS_REGION!,
      //   accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      //   bucket: process.env.AWS_S3_BUCKET!
      // });
      throw new Error('AWS S3 adapter not implemented yet');
      
    case 'azure':
    case 'azure-blob':
      // return new AzureBlobStorageAdapter({
      //   connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING!,
      //   containerName: process.env.AZURE_STORAGE_CONTAINER_NAME!
      // });
      throw new Error('Azure Blob adapter not implemented yet');
      
    case 'google':
    case 'google-drive':
      return new GoogleDriveStorageAdapter({
        clientId: process.env.GOOGLE_DRIVE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET!,
        redirectUri: process.env.GOOGLE_DRIVE_REDIRECT_URI!,
        refreshToken: process.env.GOOGLE_DRIVE_REFRESH_TOKEN!
      });
      
    case 'local':
    default:
      return new LocalStorageAdapter();
  }
}

// Re-export the StorageAdapter interface
export type { StorageAdapter } from './base';



