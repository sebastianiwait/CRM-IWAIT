/* ------------------------------------------------------------------ */
/*  Scopes de Google que pide el CRM                                   */
/*                                                                     */
/*  Un solo consentimiento cubre Drive y Gmail: el token que devuelve  */
/*  googleSignIn() sirve para las dos APIs.                            */
/* ------------------------------------------------------------------ */

/** Archivos que la propia app crea o que el usuario le abre explícitamente */
export const SCOPE_DRIVE_FILE = 'https://www.googleapis.com/auth/drive.file';

/** Listar el Drive del usuario (solo lectura) para poder importar al Data Room */
export const SCOPE_DRIVE_READONLY = 'https://www.googleapis.com/auth/drive.readonly';

/** Leer correos para registrarlos como actividad en los negocios */
export const SCOPE_GMAIL_READONLY = 'https://www.googleapis.com/auth/gmail.readonly';

/**
 * Deliberadamente NO se pide `https://www.googleapis.com/auth/drive`: da
 * lectura, escritura y borrado sobre TODO el Drive del usuario. Google lo
 * clasifica como restricted scope, lo que exige pasar una verificación de
 * seguridad antes de publicar la app fuera del Workspace propio.
 *
 * gmail.readonly también es restricted; mientras la app siga siendo interna
 * (usuarios del mismo Workspace) no hace falta verificación, pero conviene
 * saberlo antes de abrirla a terceros.
 */
export const GOOGLE_SCOPES = [
  SCOPE_DRIVE_FILE,
  SCOPE_DRIVE_READONLY,
  SCOPE_GMAIL_READONLY
];
