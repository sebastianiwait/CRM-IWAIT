import { useEffect, useState } from 'react';

/**
 * useState que sobrevive a recargas guardando en localStorage.
 *
 * La firma es idéntica a useState, así que sustituirlo por una versión
 * respaldada en Firestore más adelante no obliga a tocar los componentes:
 * basta reimplementar este hook.
 *
 * `seedVersion` sirve para reemplazar los datos ya guardados cuando cambia la
 * semilla del código. Sin él, quien abrió el CRM una vez se queda con los datos
 * viejos para siempre: localStorage siempre gana sobre el valor inicial.
 * Súbelo solo cuando el reemplazo sea intencionado — borra lo que el usuario
 * hubiese creado bajo esa clave.
 */
export function usePersistedState<T>(key: string, initial: T, seedVersion?: number) {
  const storageKey = `iwait:${key}`;
  const versionKey = `iwait:${key}:seed`;

  const [value, setValue] = useState<T>(() => {
    try {
      if (seedVersion !== undefined) {
        const stored = localStorage.getItem(versionKey);
        if (Number(stored) !== seedVersion) {
          localStorage.setItem(versionKey, String(seedVersion));
          localStorage.setItem(storageKey, JSON.stringify(initial));
          return initial;
        }
      }
      const raw = localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      // JSON corrupto o localStorage bloqueado: arrancamos con la semilla
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // cuota excedida o modo privado: seguimos en memoria sin romper la app
    }
  }, [storageKey, value]);

  return [value, setValue] as const;
}

/** Borra todos los datos persistidos del CRM (deja la sesión intacta) */
export function clearPersistedData() {
  const toRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('iwait:')) toRemove.push(k);
  }
  toRemove.forEach((k) => localStorage.removeItem(k));
}
