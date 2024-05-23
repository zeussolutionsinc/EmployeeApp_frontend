import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Have to add where the base/root directiry is
  // tell it where to start from
  base:"/",
  plugins: [react()],
})
