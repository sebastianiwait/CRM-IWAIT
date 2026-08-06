/* ------------------------------------------------------------------ */
/*  Punto único de inicialización de Firebase                          */
/*                                                                     */
/*  Antes vivía dentro de googleDrive.ts, lo que obligaba a importar   */
/*  el módulo de Drive solo para tener `auth`. Firestore además exige  */
/*  configurarse antes del primer getFirestore(), así que necesita un  */
/*  único sitio garantizado de arranque.                               */
/* ------------------------------------------------------------------ */

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  Firestore
} from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import rawConfig from '../../firebase-applet-config.json';

/**
 * Las claves web de Firebase no son secretas (viajan en el bundle de todas
 * formas). La seguridad real está en las reglas de Firestore/Storage y en los
 * dominios autorizados. Se permite sobreescribir por entorno para poder tener
 * staging y producción separados sin tocar código.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? rawConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? rawConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? rawConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? rawConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? rawConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? rawConfig.appId
};

export const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(app);

/**
 * Caché persistente en IndexedDB: la app abre con datos aunque la red esté
 * lenta, las escrituras offline se encolan solas, y varias pestañas comparten
 * la misma caché sin pelearse.
 *
 * ignoreUndefinedProperties es obligatorio aquí: el modelo tiene campos
 * opcionales por todas partes (Deal.pipeline, BacklogItem.comments,
 * DataRoomFile.dataUrl…) y Firestore lanza excepción al escribir `undefined`.
 */
export const db: Firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  ignoreUndefinedProperties: true
});

export const storage: FirebaseStorage = getStorage(app);

/** Espacio de datos del equipo. Deja la puerta abierta a multi-tenant. */
export const TEAM_ID = (import.meta.env.VITE_TEAM_ID as string | undefined) ?? 'iwait';
