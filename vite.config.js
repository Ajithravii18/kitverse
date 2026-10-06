import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({root:'client',plugins:[react()],server:{port:5174,strictPort:true,proxy:{'/api':'http://127.0.0.1:4000'}},build:{chunkSizeWarningLimit: 800, outDir:'dist', rollupOptions:{output:{manualChunks:{vendor:['react','react-dom','react-router-dom']}}}}});
