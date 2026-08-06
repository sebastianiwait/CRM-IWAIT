import { useCallback, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut as fbSignOut,
  User
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export interface AppUser {
  name: string;
  email: string;
  photoURL?: string;
  /** true cuando la sesión viene del modo demo (solo disponible en desarrollo) */
  demo?: boolean;
}

/**
 * Solo se admiten cuentas de este dominio. La validación en cliente es
 * cosmética — la de verdad son las reglas de Firestore, que repiten esta
 * misma condición sobre el token.
 */
export const ALLOWED_DOMAIN =
  (import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN as string | undefined) ?? 'iwait.io';

export const isAllowedEmail = (email?: string | null): boolean =>
  !!email && email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN.toLowerCase()}`);

/**
 * El modo demo salta la autenticación por completo, así que solo existe en
 * desarrollo. En un build de producción `import.meta.env.DEV` es false y Vite
 * elimina el botón y esta rama del bundle.
 */
export const DEMO_ENABLED = import.meta.env.DEV;

/**
 * La sesión demo vive en sessionStorage (no localStorage) a propósito: dura lo
 * que la pestaña. La sesión real NO se guarda aquí — Firebase ya la persiste en
 * IndexedDB y es la única fuente de verdad.
 */
const DEMO_KEY = 'iwait_demo_session';

const mapUser = (u: User): AppUser => ({
  name: u.displayName || u.email?.split('@')[0] || 'Usuario',
  email: u.email || '',
  photoURL: u.photoURL || undefined
});

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Sesión demo de desarrollo: se resuelve antes y no consulta a Firebase
    if (DEMO_ENABLED) {
      try {
        const raw = sessionStorage.getItem(DEMO_KEY);
        if (raw) {
          setUser(JSON.parse(raw) as AppUser);
          setLoading(false);
          return;
        }
      } catch {
        /* sessionStorage bloqueado: se ignora y sigue el flujo normal */
      }
    }

    // Recoge un login por redirect si lo hubo; no bloquea al listener
    getRedirectResult(auth).catch(() => {
      /* sin redirect pendiente */
    });

    // Firebase es la única fuente de verdad de la sesión real
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      if (!isAllowedEmail(fbUser.email)) {
        // Cuenta de fuera del dominio: se cierra la sesión inmediatamente
        await fbSignOut(auth).catch(() => undefined);
        setUser(null);
        setError(`Solo se permite el acceso con cuentas @${ALLOWED_DOMAIN}.`);
        setLoading(false);
        return;
      }
      setUser(mapUser(fbUser));
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      // Provider limpio: solo identidad, sin los scopes de Drive
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account',
        // Sugiere el dominio en el selector de cuentas de Google
        hd: ALLOWED_DOMAIN
      });
      const result = await signInWithPopup(auth, provider);

      if (!isAllowedEmail(result.user.email)) {
        await fbSignOut(auth).catch(() => undefined);
        setError(`Solo se permite el acceso con cuentas @${ALLOWED_DOMAIN}.`);
        return;
      }
      // onAuthStateChanged se encarga de fijar el usuario
    } catch (e: any) {
      const code = e?.code ?? '';

      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setError(null); // el usuario cerró el popup a propósito
      } else if (code === 'auth/popup-blocked') {
        // Bloqueador de popups o navegador embebido: reintenta por redirect
        try {
          const provider = new GoogleAuthProvider();
          provider.setCustomParameters({ hd: ALLOWED_DOMAIN });
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
  }, []);

  /** Acceso sin autenticación para desarrollo local. No existe en producción. */
  const signInAsDemo = useCallback(() => {
    if (!DEMO_ENABLED) return;
    const demoUser: AppUser = {
      name: 'Sebastian M.',
      email: `sebastian@${ALLOWED_DOMAIN}`,
      demo: true
    };
    try {
      sessionStorage.setItem(DEMO_KEY, JSON.stringify(demoUser));
    } catch {
      /* sessionStorage bloqueado: la sesión dura hasta recargar */
    }
    setUser(demoUser);
    setLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    try {
      sessionStorage.removeItem(DEMO_KEY);
    } catch {
      /* nada que limpiar */
    }
    try {
      await fbSignOut(auth);
    } catch {
      /* la sesión demo no toca Firebase */
    }
    setUser(null);
  }, []);

  return { user, loading, error, signInWithGoogle, signInAsDemo, signOut, demoEnabled: DEMO_ENABLED };
}
