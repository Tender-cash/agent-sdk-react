import * as path from 'path';
import { resolve } from 'path'
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import * as fs from 'fs';
import svgr from 'vite-plugin-svgr';

// Derive __dirname in an ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json to get module name and version
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const moduleName = pkg.name.replace(/^@.*\//, ''); // Extract 'agent-sdk' from '@tender-cash/agent-sdk'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [
      react(),
      svgr(),
      dts({
        // Specify entry root and output directory for declaration files
        entryRoot: resolve(__dirname, 'src'),
        outDir: resolve(__dirname, 'dist/types'),
        // Include source files AND global types to generate declarations from
        include: ['src/**/*', 'global.d.ts'],
        tsconfigPath: './tsconfig.json',
        // Exclude test files etc. if needed
        exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts', 'src/test.tsx', 'app/index.tsx'],
        // Use the project's tsconfig.json
        // Insert 'use client' directive at the top of the generated declaration files
        // This replaces the onwarn suppression in Rollup
        insertTypesEntry: true,
        // Copy d.ts files from dependencies (if needed, adjust based on actual usage)
        // copyDtsFiles: true,
      }),
      viteStaticCopy({
        targets: [
            {
              src: 'src/assets/*', // Copy everything from src/assets
              dest: 'assets'     // Destination relative to each outDir
            },
        ]
      })
    ],
    // Define global constants like process.env.NODE_ENV
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    resolve: {
        alias: {
          // Replicate tsconfig paths
          '@': path.resolve(__dirname, './src'),
        },
      },
    build: {
      // Enable sourcemaps for debugging
      sourcemap: true,
      // Library mode configuration
      lib: {
        // Entry point for the library
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: moduleName, // Global variable name for UMD build (if needed, not configured here)
        formats: ['es', 'cjs'], // Output formats
        fileName: (format) => `tender-cash-agent-sdk-react.${format}.js`,
      },
      // Output directories for different formats
      outDir: 'dist', // Base output directory
      // Rollup options for fine-tuning the build
      rollupOptions: {
        // Externalize react as peer dependency, but bundle react-dom for standalone widget
        external: ['react'],
        output: {
          banner: `/**
 * ${moduleName}.js
 * @summary ${pkg.description}
 * @version v${pkg.version}
 * @author ${pkg.author}
 * @license Released under the ${pkg.license} license.
 * @copyright Tender Cash
 */`,
          // Use 'exports: "named"' to ensure compatibility
          exports: 'named',
          // Control asset filenames - CSS is bundled inline, so we don't need separate CSS file
          assetFileNames: (assetInfo) => {
            // CSS files are inlined via ?inline, so they shouldn't appear as separate assets
            // But keep this for other assets like fonts, images, etc.
            return 'assets/[name]-[hash][extname]';
          },
        },
        // Suppress warnings similar to the Rollup config
        onwarn(warning, warn) {
            if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('"use client"')) {
              return; // Ignore "use client" warnings
            }
            // Suppress preserveModules warning for CSS files if needed
            // Vite often handles CSS differently, but keep this in mind if warnings appear
            if (warning.code === 'PRESERVE_MODULES_CONFLICT_WITH_CSS' && isProduction) {
                 return;
            }
             // Suppress warnings about empty chunks if they arise, often from type generation
            if (warning.code === 'EMPTY_CHUNK') {
               return;
            }
            warn(warning); // Pass other warnings along
          },
      },
      // Minify production build
      minify: isProduction ? 'esbuild' : false,
      // Bundle CSS inline instead of extracting to separate file
      // CSS is already inlined via ?inline import, but this ensures no separate CSS file is created
      cssCodeSplit: false,
      // Generate manifest file if needed (usually for apps, not libraries)
      // manifest: true,
      // Empty the output directory before building
      emptyOutDir: true, // Keep existing dist content if needed (e.g., from other build steps) -> Changed to true to match `yarn flush`
    },
    // Server configuration for development (replaces rollup-plugin-serve/livereload)
    server: {
      host: '0.0.0.0', // Allow access from network
      port: 4234, // Match Rollup config port
    },
  };
}); 
