/** Experience pages co-locate their stylesheet with their components; the
 * bundler (Vite) owns CSS loading — TypeScript only needs the module shape. */
declare module '*.css';
