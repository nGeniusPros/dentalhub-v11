"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_react_1 = require("@vitejs/plugin-react");
const path_1 = require("path"); // Import path
// https://vite.dev/config/
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_react_1.default)()],
    resolve: {
        alias: {
            '@': path_1.default.resolve(__dirname, './src'), // Define @ alias
        },
    },
    define: {
        'process.env': {
            SUPABASE_URL: process.env.VITE_SUPABASE_URL,
            SUPABASE_SERVICE_KEY: process.env.VITE_SUPABASE_SERVICE_KEY,
            SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY
        }
    }
});
