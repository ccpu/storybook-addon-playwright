declare module '@vitejs/plugin-react' {
  export interface ReactPluginOptions {
    [key: string]: unknown;
  }

  export default function react(options?: ReactPluginOptions): any;
}
declare module '@vitejs/plugin-react' {
  import type { PluginOption } from 'vite';

  export interface ReactPluginOptions {
    [key: string]: unknown;
  }

  export default function react(options?: ReactPluginOptions): PluginOption;
}
