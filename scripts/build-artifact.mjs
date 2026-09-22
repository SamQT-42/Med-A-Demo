/**
 * Repackages `dist/` into `artifact/`, ready to publish as a hosted page.
 *
 * The host supplies the <!doctype>/<html>/<head>/<body> skeleton, so the entry
 * file is body-level content plus our own <title>, stylesheet link and module
 * script. Asset filenames are normalised so the published paths stay stable
 * across rebuilds.
 *
 * Usage:  npm run build && node scripts/build-artifact.mjs
 */
import { copyFileSync, mkdirSync, readdirSync, writeFileSync, existsSync } from 'node:fs';

if (!existsSync('dist/assets')) {
  console.error('No dist/ found. Run `npm run build` first.');
  process.exit(1);
}

mkdirSync('artifact/assets', { recursive: true });

const files = readdirSync('dist/assets');
const js = files.find((f) => f.endsWith('.js'));
const css = files.find((f) => f.endsWith('.css'));
if (!js || !css) {
  console.error('Expected one .js and one .css in dist/assets.');
  process.exit(1);
}

copyFileSync(`dist/assets/${js}`, 'artifact/assets/app.js');
copyFileSync(`dist/assets/${css}`, 'artifact/assets/app.css');

writeFileSync(
  'artifact/index.html',
  `<title>Med-A Support Library</title>
<link rel="stylesheet" href="assets/app.css" />
<style>
  /* The host skeleton sets its own body font and ground; Med-A owns both. */
  html, body { margin: 0; padding: 0; background: var(--c-bg); }
  #root { min-height: 100%; }
</style>
<div id="root"></div>
<script type="module" src="assets/app.js"></script>
`,
);

console.log('artifact/ ready: index.html + assets/app.js + assets/app.css');
