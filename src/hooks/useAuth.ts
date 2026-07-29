import { useCallback, useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
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

  // Restaura la sesión guardada al cargar
  useEffect(() => {
    setUser(readStored());
    setLoading(false);
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
      } else if (code === 'auth/operation-not-allowed' || code === 'auth/configuration-not-found') {
        setError(
          'Google Sign-In todavía no está habilitado en la consola de Firebase. Usa el acceso de demo mientras tanto.'
        );
      } else if (code === 'auth/unauthorized-domain') {
        setError('Este dominio no está autorizado en Firebase Auth. Añádelo en Authentication → Settings.');
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
