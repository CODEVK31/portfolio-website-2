import * as esbuild from 'esbuild';
import { mkdirSync, copyFileSync, cpSync, existsSync, readdirSync, statSync, writeFileSync, readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, 'dist');
const isWatch = process.argv.includes('--watch');

// Clean dist
mkdirSync(outDir, { recursive: true });

const ctx = await esbuild.context({
  entryPoints: [resolve(here, 'entry.jsx')],
  bundle: true,
  outfile: join(outDir, 'app.js'),
  format: 'iife',
  target: ['es2020'],
  loader: { '.jsx': 'jsx', '.js': 'jsx' },
  jsx: 'automatic',
  jsxImportSource: 'react',
  inject: [resolve(here, 'react-shim.js')],
  minify: !isWatch,
  sourcemap: isWatch ? 'inline' : false,
  legalComments: 'none',
  define: { 'process.env.NODE_ENV': isWatch ? '"development"' : '"production"' },
  logLevel: 'info',
});

await ctx.rebuild();

// Copy static files
copyFileSync(resolve(here, 'styles.css'), join(outDir, 'styles.css'));

// Copy uploads directory
const uploadsSrc = resolve(here, 'uploads');
if (existsSync(uploadsSrc)) {
  cpSync(uploadsSrc, join(outDir, 'uploads'), { recursive: true });
}

// Copy resume PDF (referenced as uploads/Vinayak_Khandelwal_A_Resume.pdf)
const resumeSrc = resolve(here, 'Vinayak_Khandelwal_Resume.pdf');
if (existsSync(resumeSrc)) {
  copyFileSync(resumeSrc, join(outDir, 'Vinayak_Khandelwal_Resume.pdf'));
}

// Copy og.png if present
const ogSrc = resolve(here, 'og.png');
if (existsSync(ogSrc)) copyFileSync(ogSrc, join(outDir, 'og.png'));

// Copy index.html — source already references the bundled app.js directly
copyFileSync(resolve(here, 'index.html'), join(outDir, 'index.html'));

console.log('Built to', outDir);

if (isWatch) {
  await ctx.watch();
  console.log('Watching for changes…');
} else {
  await ctx.dispose();
}
