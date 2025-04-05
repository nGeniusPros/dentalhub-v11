// Load environment variables from .env file
require('dotenv').config();

// Use require for imports in CommonJS
const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const path = require('path');

// Use module.exports for exporting
const { execSync } = require('child_process');

// Skip MCP server compilation for testing
console.log('Skipping MCP server compilation for testing.');
// try {
//   execSync('tsc -p tsconfig.mcp.json', { stdio: 'inherit' });
//   console.log('MCP server code built successfully.');
// } catch (error) {
//   console.error('Failed to build MCP server code:', error);
//   process.exit(1); // Exit if build fails
// }

module.exports = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    // process.env should be available globally in Node.js
    'process.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'process.env.VITE_SUPABASE_SERVICE_KEY': JSON.stringify(process.env.VITE_SUPABASE_SERVICE_KEY),
    'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY)
  },
  server: {
    proxy: {
      '/.netlify/functions/mcp': {
        target: 'http://localhost:60546', // Point to your local MCP server
        changeOrigin: true,
        // Optional: rewrite path if needed
        // rewrite: (path) => path.replace(/^\/\.netlify\/functions\/mcp/, '')
      },
      '/.netlify/functions/database-mcp': {
        target: 'http://localhost:60547', // Point to your database MCP server
        changeOrigin: true,
      },
    },
  },
});
