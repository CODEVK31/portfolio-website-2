/* Generates og.png from an inline SVG so social previews render correctly. */
import sharp from 'sharp';
import { writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

const W = 1200, H = 630;

// Inline web-safe font stack mirrors the site (Fraunces / Inter Tight / JetBrains Mono).
// Browsers and social crawlers render SVG fonts using system fallbacks when web fonts
// aren't embedded, so we lean on weight + size to carry voice.
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="bgGlow" cx="92%" cy="6%" r="60%">
      <stop offset="0%" stop-color="#FF6D5A" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#0E1119" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vGlow" cx="0%" cy="80%" r="55%">
      <stop offset="0%" stop-color="#6E6EF6" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="#0E1119" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="1.6" cy="1.6" r="1.6" fill="#242B3D" opacity="0.55"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="#0E1119"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <rect width="${W}" height="${H}" fill="url(#bgGlow)"/>
  <rect width="${W}" height="${H}" fill="url(#vGlow)"/>

  <!-- Coral logo plate -->
  <g transform="translate(80,80)">
    <rect width="44" height="44" rx="10" fill="#FF6D5A"/>
    <g transform="translate(10,10)" fill="#0E1119">
      <circle cx="5" cy="12" r="2.4"/>
      <circle cx="19" cy="6" r="2.4"/>
      <circle cx="19" cy="18" r="2.4"/>
      <path d="M7 11 L17 7 M7 13 L17 17" stroke="#0E1119" stroke-width="1.5" fill="none"/>
    </g>
  </g>
  <text x="140" y="111" font-family="'JetBrains Mono', ui-monospace, monospace"
        font-size="14" letter-spacing="2.8" fill="#8B93A8" font-weight="600">
    VINAYAK · PORTFOLIO
  </text>

  <!-- Headline -->
  <text x="80" y="252" font-family="'Fraunces', Georgia, serif" font-size="76"
        fill="#ECEEF3" font-weight="500" letter-spacing="-2.4">
    I build AI workflows that
  </text>
  <text x="80" y="338" font-family="'Fraunces', Georgia, serif" font-size="76"
        fill="#FF6D5A" font-weight="500" font-style="italic" letter-spacing="-2.4">
    do the boring work.
  </text>

  <!-- Proof row -->
  <g transform="translate(80,418)" font-family="'JetBrains Mono', ui-monospace, monospace"
     font-size="20" letter-spacing="1.4">
    <circle cx="6" cy="-7" r="6" fill="#FF6D5A"/>
    <text x="22" y="0" fill="#ECEEF3" font-weight="500">8 shipped</text>

    <circle cx="180" cy="-7" r="6" fill="#00C896"/>
    <text x="196" y="0" fill="#ECEEF3" font-weight="500">1 live in production</text>

    <circle cx="460" cy="-7" r="6" fill="#F5B544"/>
    <text x="476" y="0" fill="#ECEEF3" font-weight="500">World Rank #4 ASME</text>
  </g>

  <!-- Workflow nodes preview (top-right corner) -->
  <g transform="translate(770,80)" font-family="'JetBrains Mono', ui-monospace, monospace">
    <!-- node 1 -->
    <rect x="0" y="0" width="160" height="50" rx="6" fill="#161B26" stroke="#242B3D"/>
    <rect x="0" y="0" width="3" height="50" fill="#00C896"/>
    <text x="14" y="22" font-size="11" fill="#ECEEF3" font-weight="500">trigger</text>
    <text x="14" y="38" font-size="9" fill="#8B93A8" letter-spacing="1.4">SCHEDULE</text>

    <path d="M160 25 L210 25 L210 80 L260 80" stroke="#FF6D5A" stroke-width="1.8" fill="none"/>
    <circle cx="260" cy="80" r="3" fill="#FF6D5A"/>

    <!-- node 2 -->
    <rect x="260" y="55" width="160" height="50" rx="6" fill="#161B26" stroke="#FF6D5A" stroke-width="1.5"/>
    <rect x="260" y="55" width="3" height="50" fill="#FF6D5A"/>
    <text x="274" y="77" font-size="11" fill="#ECEEF3" font-weight="500">claude</text>
    <text x="274" y="93" font-size="9" fill="#FF6D5A" letter-spacing="1.4">AI · EXTRACT</text>

    <path d="M420 80 L470 80 L470 135 L520 135" stroke="#242B3D" stroke-width="1.8" fill="none"/>
    <circle cx="520" cy="135" r="3" fill="#242B3D"/>

    <!-- node 3 -->
    <rect x="160" y="110" width="160" height="50" rx="6" fill="#161B26" stroke="#242B3D"/>
    <rect x="160" y="110" width="3" height="50" fill="#6E6EF6"/>
    <text x="174" y="132" font-size="11" fill="#ECEEF3" font-weight="500">sheets</text>
    <text x="174" y="148" font-size="9" fill="#8B93A8" letter-spacing="1.4">APPEND ROW</text>
  </g>

  <!-- Footer -->
  <text x="80" y="${H - 80}" font-family="'JetBrains Mono', ui-monospace, monospace"
        font-size="14" letter-spacing="2" fill="#5D6680" font-weight="500">
    vinayakkhandelwal.com · the whole site is one n8n workflow
  </text>
  <text x="80" y="${H - 52}" font-family="'JetBrains Mono', ui-monospace, monospace"
        font-size="13" letter-spacing="1.4" fill="#727B92" font-weight="400">
    Final-year B.Tech · Shiv Nadar University · Delhi NCR
  </text>
</svg>`;

const out = resolve(here, 'og.png');
await sharp(Buffer.from(svg)).png().toFile(out);
console.log('Wrote', out);
