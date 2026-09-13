import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // formbar's own frontend usually runs on 5173, so we sit one over from it
    port: 5174
  }
})
