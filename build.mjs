import * as esbuild from 'esbuild';
import { mkdirSync, copyFileSync, cpSync, existsSync, readdirSync, statSync, writeFileSync, readFileSync, renameSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, 'dist');
const isWatch = process.argv.includes('--watch');

// Clean dist so stale (or old-hash) bundles never linger in the output.
rmSync(outDir, { recursive: true, force: true });
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

// ── Asset fingerprinting ──────────────────────────────────────────────────
// Production builds get content-hashed filenames (app-<hash>.js,
// styles-<hash>.css) so every deploy is a brand-new URL no browser has cached.
// Watch/dev builds keep fixed names so the dev HTML reference stays valid
// across rebuilds. Either way we read the SOURCE index.html and write the
// rewritten copy into dist/ — the source files are never modified.
const hash8 = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 8);

const cssBuf  = readFileSync(resolve(here, 'styles.css'));
const cssName = isWatch ? 'styles.css' : `styles-${hash8(cssBuf)}.css`;
writeFileSync(join(outDir, cssName), cssBuf);

let jsName = 'app.js';
if (!isWatch) {
  jsName = `app-${hash8(readFileSync(join(outDir, 'app.js')))}.js`;
  renameSync(join(outDir, 'app.js'), join(outDir, jsName));
}

const html = readFileSync(resolve(here, 'index.html'), 'utf8')
  .replace('href="styles.css"', `href="${cssName}"`)
  .replace('src="app.js"',      `src="${jsName}"`);
writeFileSync(join(outDir, 'index.html'), html);

console.log(`Built to ${outDir}  (${jsName}, ${cssName})`);

if (isWatch) {
  await ctx.watch();
  console.log('Watching for changes…');
} else {
  await ctx.dispose();
}
