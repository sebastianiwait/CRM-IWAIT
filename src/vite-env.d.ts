/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Dominio de correo permitido para entrar. Por defecto 'iwait.io'. */
  readonly VITE_ALLOWED_EMAIL_DOMAIN?: string;
  /** Espacio de datos del equipo en Firestore. Por defecto 'iwait'. */
  readonly VITE_TEAM_ID?: string;

  /** Config de Firebase. Si falta, se usa firebase-applet-config.json. */
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
