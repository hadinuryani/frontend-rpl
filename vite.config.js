import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  server: {
    host: true,
    allowedHosts: [
      'acronymous-overcoolly-shana.ngrok-free.dev'
    ]
  },

  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})