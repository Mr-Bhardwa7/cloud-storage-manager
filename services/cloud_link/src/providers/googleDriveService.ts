import { google } from 'googleapis';
import type { OAuth2Client, Credentials } from 'google-auth-library';
import type { GoogleDriveFile, GoogleDriveTokens, GoogleDriveUser } from '@/types/google-drive';

interface StorageQuota {
  limit: number;
  used: number;
  remaining: number;
}

interface ActivityLog {
  time: string;
  action: string;
  fileId: string;
  fileName: string;
  user: string;
}

export class GoogleDriveService {
  private oauth2Client: OAuth2Client;
  private drive: any;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
  }

  static getAuthUrl(): string {
    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const SCOPES = [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.metadata.readonly',
      'https://www.googleapis.com/auth/drive.activity.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];

    return client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: SCOPES,
    });
  }

  async connectAccount(authCode: string) {
    try {
      const { tokens } = await this.oauth2Client.getToken(authCode);
      this.oauth2Client.setCredentials(tokens);

      const user = await this.getAccountInfo();
      const typedTokens: GoogleDriveTokens = {
        access_token: tokens.access_token!,
        refresh_token: tokens.refresh_token!,
        scope: tokens.scope!,
        token_type: tokens.token_type!,
        expiry_date: tokens.expiry_date!,
      };

      await this.storeTokens(user.id, typedTokens);
      return { success: true };
    } catch (error) {
      console.error('Error connecting account:', error);
      throw new Error('Failed to connect Google Drive account');
    }
  }

  async disconnectAccount(userId: string) {
    try {
      const token = this.oauth2Client.credentials.access_token;
      if (token) {
        await this.oauth2Client.revokeToken(token);
      }

      await this.removeTokens(userId);
      return { success: true };
    } catch (error) {
      console.error('Error disconnecting account:', error);
      throw new Error('Failed to disconnect Google Drive account');
    }
  }

  async syncAccount(userId: string) {
    try {
      const filesList = await this.drive.files.list({
        fields: 'files(id, name, mimeType, modifiedTime, size, shared)',
        pageSize: 1000,
      });

      const typedFiles: GoogleDriveFile[] = (filesList.data.files || []).map((f:any) => ({
        id: f.id,
        name: f.name,
        mimeType: f.mimeType,
        modifiedTime: f.modifiedTime,
        size: parseInt(f.size || '0'),
      }));

      await this.indexFiles(userId, typedFiles);
      return { success: true, filesCount: typedFiles.length };
    } catch (error) {
      console.error('Error syncing account:', error);
      throw new Error('Failed to sync Google Drive account');
    }
  }

  async getStorageInfo(): Promise<StorageQuota> {
    try {
      const about = await this.drive.about.get({ fields: 'storageQuota' });
      const quota = about.data.storageQuota;

      return {
        limit: parseInt(quota?.limit || '0'),
        used: parseInt(quota?.usage || '0'),
        remaining: parseInt(quota?.limit || '0') - parseInt(quota?.usage || '0'),
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      throw new Error('Failed to get storage information');
    }
  }

async getActivityLogs(maxResults = 50): Promise<ActivityLog[]> {
  try {
    const activityApi = google.driveactivity({ version: 'v2', auth: this.oauth2Client });

    const res = await activityApi.activity.query({
      requestBody: {
        pageSize: maxResults,
      },
    });

    return (res.data.activities || []).map((act): ActivityLog => {
      let action = 'Unknown';

      const pad = act.primaryActionDetail;
      if (pad?.edit) {
        action = 'Edit';
      } else if (pad?.create) {
        action = 'Create';
      } else if (pad?.delete) {
        action = 'Delete';
      } else if (pad?.move) {
        action = 'Move';
      } else if (pad?.rename) {
        action = 'Rename';
      } else if (pad?.permissionChange) {
        action = 'Permission Change';
      } else if (pad?.comment) {
        action = 'Comment';
      }

      return {
        time: act.timestamp || '',
        action,
        fileId: act.targets?.[0]?.driveItem?.name || '',
        fileName: act.targets?.[0]?.driveItem?.title || '',
        user: act.actors?.[0]?.user?.knownUser?.personName || 'Unknown',
      };
    });
  } catch (error) {
    console.error('Error getting activity logs:', error);
    throw new Error('Failed to get activity logs');
  }
}


  async getFileVersions(fileId: string) {
    try {
      const versions = await this.drive.revisions.list({
        fileId,
        fields: 'revisions(id, modifiedTime, size, lastModifyingUser)',
      });

      return versions.data.revisions;
    } catch (error) {
      console.error('Error getting file versions:', error);
      throw new Error('Failed to get file versions');
    }
  }

  async getAccountInfo(): Promise<GoogleDriveUser> {
    try {
      const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
      const res = await oauth2.userinfo.get();
      return {
        id: res.data.id!,
        email: res.data.email!,
        name: res.data.name!,
        picture: res.data.picture!,
      };
    } catch (error) {
      console.error('Error fetching account info:', error);
      throw new Error('Failed to fetch account info');
    }
  }

  async getStorageInsights() {
    const [storage, files, user] = await Promise.all([
      this.getStorageInfo(),
      this.drive.files.list({
        fields: 'files(id, name, mimeType, shared)',
        pageSize: 1000,
      }),
      this.getAccountInfo(),
    ]);

    const fileTypes: Record<string, number> = {};
    (files.data.files || []).forEach((f:any) => {
      const type = f.mimeType || 'unknown';
      fileTypes[type] = (fileTypes[type] || 0) + 1;
    });

    return {
      ...user,
      used: storage.used,
      total: storage.limit,
      sharedFileCount: (files.data.files || []).filter((f:any)=> f.shared)?.length || 0,
      fileTypesBreakdown: fileTypes,
      versioningSupported: true,
    };
  }

  // --- Placeholders for secure token/file storage ---
  private async storeTokens(userId: string, tokens: GoogleDriveTokens) {
    // TODO: Save tokens to DB securely
  }

  private async removeTokens(userId: string) {
    // TODO: Remove tokens from DB
  }

  private async indexFiles(userId: string, files: GoogleDriveFile[]) {
    // TODO: Store file metadata in DB or indexer
  }
}
