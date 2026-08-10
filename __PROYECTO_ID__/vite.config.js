import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// NTE-UAN-APK-001 v1.3 §4.1
// OBLIGATORIO: base './' — rutas relativas para WebView de Capacitor
// ADVERTENCIA: Omitir este parámetro causa pantalla en blanco en el APK
export default defineConfig({
  plugins: [react()],
  base: './',
})
