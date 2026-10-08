/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FESTIVAL_MAGAZINE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
