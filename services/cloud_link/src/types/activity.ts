export interface Activity {
  id: string;
  type: 'sync' | 'upload' | 'delete' | 'share' | 'connection' | 'error' | 'permission' | 'rename' | 'move';
  title: string;
  description: string;
  timestamp: string;
  account: {
    name: string;
    icon: string;
    email?: string;
    type: 'drive' | 'dropbox' | 'onedrive' | 's3';
    provider: string;
  };
  details?: {
    size?: string;
    path?: string;
    affectedFiles?: number;
    duration?: string;
    sourceLocation?: string;
    destinationLocation?: string;
    sharedWith?: string[];
    errorDetails?: string;
    changes?: {
      added: number;
      modified: number;
      deleted: number;
    };
  };
  status?: 'success' | 'pending' | 'error' | 'warning';
  priority?: 'high' | 'medium' | 'low';
}