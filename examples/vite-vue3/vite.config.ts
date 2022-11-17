import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import progress from "../../dist/index.mjs";

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue(), progress()]
})
