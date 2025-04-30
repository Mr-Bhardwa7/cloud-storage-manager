export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size: number;
}

export interface GoogleDriveTokens {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}

export interface GoogleDriveUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}