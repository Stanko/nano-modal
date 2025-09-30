/** @type {import('vite').UserConfig} */

export default {
  server: {
    port: 1234,
    host: true,
    allowedHosts: true,
  },
  base: "./",
  build: {
    outDir: "./docs",
  },
};
