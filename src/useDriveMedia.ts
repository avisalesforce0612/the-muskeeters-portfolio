import { useEffect, useState } from 'react';
import { siteConfig } from './siteConfig';

export interface DriveMediaFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime?: string;
}

interface DriveFilesResponse {
  files?: DriveMediaFile[];
  nextPageToken?: string;
  error?: { message?: string };
}

interface DriveMediaState {
  photos: DriveMediaFile[];
  videos: DriveMediaFile[];
  loading: boolean;
  error: string;
  configured: boolean;
}

const apiKey = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY?.trim() ?? '';
const isMediaFile = (file: DriveMediaFile) =>
  file.mimeType.startsWith('image/') || file.mimeType.startsWith('video/');

export const driveThumbnailUrl = (fileId: string, width = 1200) =>
  `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w${width}`;

export const driveVideoPreviewUrl = (fileId: string) =>
  `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview`;

export function useDriveMedia(): DriveMediaState {
  const configured = Boolean(siteConfig.driveFolderId && apiKey);
  const [state, setState] = useState<DriveMediaState>({
    photos: [],
    videos: [],
    loading: configured,
    error: '',
    configured,
  });

  useEffect(() => {
    if (!configured) {
      setState({ photos: [], videos: [], loading: false, error: '', configured: false });
      return;
    }

    let cancelled = false;
    let activeController: AbortController | null = null;

    async function loadMedia() {
      if (cancelled || activeController) return;
      const controller = new AbortController();
      activeController = controller;
      try {
        const files: DriveMediaFile[] = [];
        let pageToken: string | undefined;

        do {
          const params = new URLSearchParams({
            q: `'${siteConfig.driveFolderId}' in parents and trashed = false`,
            fields: 'nextPageToken,files(id,name,mimeType,createdTime)',
            orderBy: 'createdTime desc',
            pageSize: '1000',
            // These flags are required when the connected folder is in a Shared Drive.
            // They remain safe for normal My Drive folders.
            includeItemsFromAllDrives: 'true',
            supportsAllDrives: 'true',
            key: apiKey,
          });
          if (pageToken) params.set('pageToken', pageToken);

          const response = await fetch(
            `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
            { signal: controller.signal },
          );
          const result = await response.json() as DriveFilesResponse;
          if (!response.ok) {
            throw new Error(result.error?.message || `Google Drive returned ${response.status}.`);
          }
          files.push(...(result.files ?? []).filter(isMediaFile));
          pageToken = result.nextPageToken;
        } while (pageToken && !cancelled);

        if (!cancelled) {
          const ordered = files.sort((a, b) =>
            (b.createdTime ?? '').localeCompare(a.createdTime ?? ''),
          );
          setState({
            photos: ordered.filter((file) => file.mimeType.startsWith('image/')),
            videos: ordered.filter((file) => file.mimeType.startsWith('video/')),
            loading: false,
            error: '',
            configured: true,
          });
        }
      } catch (error) {
        if (cancelled || (error instanceof DOMException && error.name === 'AbortError')) return;
        setState({
          photos: [],
          videos: [],
          loading: false,
          error: error instanceof Error ? error.message : 'Could not load media from Google Drive.',
          configured: true,
        });
      } finally {
        if (activeController === controller) activeController = null;
      }
    }

    void loadMedia();
    const refreshTimer = window.setInterval(() => void loadMedia(), 5 * 60 * 1000);
    return () => {
      cancelled = true;
      activeController?.abort();
      window.clearInterval(refreshTimer);
    };
  }, [configured]);

  return state;
}
