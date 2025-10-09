/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    // başka env değişkenlerin olursa buraya ekleyebilirsin
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  