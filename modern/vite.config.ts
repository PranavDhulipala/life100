import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({base:'/life100/',plugins:[react(),VitePWA({registerType:'autoUpdate',includeAssets:['icon.svg'],manifest:{name:'Life100 · Personal OS',short_name:'Life100',start_url:'/life100/',scope:'/life100/',display:'standalone',theme_color:'#11131b',background_color:'#11131b',icons:[{src:'icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'}]},workbox:{cleanupOutdatedCaches:true,globPatterns:['**/*.{js,css,html,svg}']}})]})
