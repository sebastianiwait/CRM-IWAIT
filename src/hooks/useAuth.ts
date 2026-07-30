import { useCallback, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as fbSignOut
} from 'firebase/auth';
import { auth } from '../lib/googleDrive';

export interface AppUser {
  name: string;
  email: string;
  photoURL?: string;
  /** true cuando la sesión viene del modo demo (sin Google real) */
  demo?: boolean;
}

const STORAGE_KEY = 'iwait_session';

const readStored = (): AppUser | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AppUser) : null;
  } catch {
    return null;
  }
};

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restaura la sesión guardada y recoge el resultado de un login por redirect
  useEffect(() => {
    const stored = readStored();
    if (stored) {
      setUser(stored);
      setLoading(false);
      return;
    }
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          const u = result.user;
          const mapped: AppUser = {
            name: u.displayName || u.email?.split('@')[0] || 'Usuario',
            email: u.email || '',
            photoURL: u.photoURL || undefined
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
          setUser(mapped);
        }
      })
      .catch(() => {
        /* sin redirect pendiente */
      })
      .finally(() => setLoading(false));
  }, []);

  const persist = useCallback((u: AppUser | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      // Provider limpio: solo identidad, sin los scopes de Drive
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const u = result.user;
      persist({
        name: u.displayName || u.email?.split('@')[0] || 'Usuario',
        email: u.email || '',
        photoURL: u.photoURL || undefined
      });
    } catch (e: any) {
      const code = e?.code ?? '';

      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setError(null); // el usuario cerró el popup a propósito
      } else if (code === 'auth/popup-blocked') {
        // Bloqueador de popups o navegador embebido: reintenta por redirect
        try {
          const provider = new GoogleAuthProvider();
          await signInWithRedirect(auth, provider);
          return; // la página navega a Google; el resultado se recoge al volver
        } catch {
          setError('El navegador bloqueó la ventana de Google. Permite las ventanas emergentes de este sitio e inténtalo de nuevo.');
        }
      } else if (code === 'auth/operation-not-allowed' || code === 'auth/configuration-not-found') {
        setError(
          'Google Sign-In no está habilitado en Firebase. Ve a Authentication → Sign-in method y activa Google.'
        );
      } else if (code === 'auth/unauthorized-domain') {
        setError(
          `El dominio "${window.location.hostname}" no está autorizado. Añádelo en Firebase → Authentication → Settings → Authorized domains.`
        );
      } else {
        setError(e?.message || 'No se pudo iniciar sesión con Google.');
      }
    } finally {
      setLoading(false);
    }
  }, [persist]);

  /** Acceso MVP mientras se termina de conectar Google */
  const signInAsDemo = useCallback(() => {
    persist({
      name: 'Sebastian M.',
      email: 'sebastian@iwait.io',
      demo: true
    });
  }, [persist]);

  const signOut = useCallback(async () => {
    try {
      await fbSignOut(auth);
    } catch {
      /* la sesión demo no toca Firebase */
    }
    persist(null);
  }, [persist]);

  return { user, loading, error, signInWithGoogle, signInAsDemo, signOut };
}
