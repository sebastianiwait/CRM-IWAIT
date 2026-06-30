import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use Google Auth Provider configured with required scopes
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/drive.readonly');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize Auth listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Fallback or retry cache if available
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Initiate Google Sign in
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain access token from Google.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Error during Google Sign In:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Get active access token
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

// Sign out / Logout
export const logoutUser = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Google Drive file interface
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
}

// Translate byte count to human-readable size
export const formatBytes = (bytesStr?: string): string => {
  if (!bytesStr) return 'Desconocido';
  const bytes = parseInt(bytesStr, 10);
  if (isNaN(bytes)) return 'Desconocido';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// List Google Drive files
export const listDriveFiles = async (accessToken: string): Promise<DriveFile[]> => {
  try {
    const fields = 'files(id, name, mimeType, size, modifiedTime, webViewLink)';
    const query = encodeURIComponent("trashed = false");
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${encodeURIComponent(fields)}&pageSize=30`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!response.ok) {
      const errText = await response.text();
      console.error('Error response from listDriveFiles:', errText);
      throw new Error(`Google API returned code ${response.status}`);
    }

    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error in listDriveFiles REST API:', error);
    throw error;
  }
};

// Create / Upload text or summary file to Google Drive
export const uploadFileToDrive = async (
  accessToken: string,
  fileName: string,
  content: string,
  mimeType: string = 'text/plain'
): Promise<DriveFile> => {
  try {
    const metadata = {
      name: fileName,
      mimeType: mimeType,
    };

    // Construct the multipart/related body
    const boundary = 'foo_bar_boundary';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const body = 
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${mimeType}\r\n` +
      'Content-Transfer-Encoding: base64\r\n\r\n' +
      // Standard base64 encoding of content
      btoa(unescape(encodeURIComponent(content))) +
      closeDelimiter;

    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: body,
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Upload Error Response:', errText);
      throw new Error(`Failed to upload file to Google Drive: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in uploadFileToDrive REST API:', error);
    throw error;
  }
};

// Delete a Google Drive file
export const deleteDriveFile = async (accessToken: string, fileId: string): Promise<boolean> => {
  try {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Delete Error Response:', errText);
      throw new Error(`Failed to delete Drive file: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error in deleteDriveFile REST API:', error);
    throw error;
  }
};
