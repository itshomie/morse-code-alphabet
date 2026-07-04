import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { transformSync } from 'esbuild';
import {
  SITE,
  MORSE,
  PROSIGNS,
  importantLinks,
  pageMeta,
  primaryNav,
  sourceLinks
} from './siteData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const assetVersion = crypto
  .createHash('sha256')
  .update(fs.readFileSync(path.join(root, 'src', 'styles.css')))
  .update(fs.readFileSync(path.join(root, 'src', 'app.js')))
  .digest('hex')
  .slice(0, 10);
const stylesheetHref = `/assets/styles.css?v=${assetVersion}`;
const appScriptHref = `/assets/app.js?v=${assetVersion}`;
const googleAnalyticsId = 'G-364L3NYKST';
const analyticsCode = transformSync(`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  (() => {
    let loaded = false;
    const loadAnalytics = () => {
      if (loaded) return;
      loaded = true;
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}';
      document.head.append(script);
      gtag('js', new Date());
      gtag('config', '${googleAnalyticsId}');
    };
    const earlyEvents = ['pointerdown', 'keydown'];
    earlyEvents.forEach((name) => window.addEventListener(name, loadAnalytics, { once: true, passive: true }));
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') loadAnalytics();
    }, { once: true });
    window.addEventListener('load', () => window.setTimeout(loadAnalytics, 4200), { once: true });
  })();
`, { loader: 'js', minify: true, target: 'es2019', legalComments: 'none' }).code.trim();
const analyticsTag = `<script>${analyticsCode}</script>`;
const criticalCss = transformSync(`
  :root {
    color-scheme: light;
    --bg: #f7f9fd;
    --surface: #ffffff;
    --surface-soft: #fbfcff;
    --text: #06163f;
    --muted: #5d6b85;
    --line: #dfe6f0;
    --line-strong: #c9d4e4;
    --accent: #1768d8;
    --accent-dark: #08295f;
    --accent-soft: #edf4ff;
    --swap-bg: #08295f;
    --swap-text: #ffffff;
    --swap-ring: rgba(23, 104, 216, 0.18);
    --radius: 8px;
    --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    --sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  :root[data-theme="dark"] {
    color-scheme: dark;
    --bg: #0a101b;
    --surface: #141f30;
    --surface-soft: #101928;
    --text: #eff5ff;
    --muted: #b2bfd2;
    --line: #2d3d55;
    --line-strong: #425773;
    --accent: #8db9ff;
    --accent-dark: #d7e6ff;
    --accent-soft: #1b2e4b;
    --swap-bg: #18243a;
    --swap-text: #d7e6ff;
    --swap-ring: rgba(141, 185, 255, 0.22);
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: var(--sans);
    color: var(--text);
    background: linear-gradient(180deg, rgba(231, 238, 248, 0.76), rgba(255, 255, 255, 0) 430px), var(--bg);
    line-height: 1.55;
    text-rendering: optimizeLegibility;
  }
  :root[data-theme="dark"] body {
    background: linear-gradient(180deg, rgba(33, 48, 72, 0.72), rgba(10, 16, 27, 0) 460px), var(--bg);
  }
  a { color: inherit; text-decoration: none; }
  button, input, textarea { font: inherit; }
  main { width: min(1240px, calc(100% - 40px)); margin: 0 auto; }
  .skip-link { position: absolute; left: 12px; top: -48px; z-index: 20; background: var(--accent-dark); color: white; padding: 10px 14px; border-radius: var(--radius); }
  .skip-link:focus { top: 12px; }
  .site-header {
    position: sticky;
    top: 0;
    z-index: 10;
    min-height: 74px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 28px;
    padding: 0 max(24px, calc((100vw - 1240px) / 2));
    border-bottom: 1px solid var(--line);
    background: color-mix(in srgb, var(--surface) 88%, transparent);
    backdrop-filter: blur(18px);
  }
  .brand, .footer-brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 850; letter-spacing: 0; }
  .brand-signal { display: inline-grid; grid-auto-flow: column; align-items: center; gap: 4px; }
  .brand-signal i, .brand-signal b { display: block; height: 5px; border-radius: 999px; background: var(--accent); }
  .brand-signal i { width: 5px; }
  .brand-signal b { width: 18px; }
  .main-nav { justify-self: center; display: flex; align-items: center; gap: clamp(18px, 3vw, 46px); font-size: 0.94rem; font-weight: 760; }
  .main-nav a { padding: 26px 0; }
  .icon-button { min-width: 48px; height: 38px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); color: var(--text); font-size: 0.78rem; font-weight: 800; }
  .hero { padding: 22px 0 30px; }
  .hero-top { position: relative; display: grid; place-items: center; min-height: clamp(290px, 29vw, 440px); overflow: hidden; isolation: isolate; }
  .hero-copy { position: relative; z-index: 2; display: grid; justify-items: center; max-width: 980px; margin: 0 auto; text-align: center; }
  .hero-copy h1 { max-width: 720px; margin: 0; font-size: clamp(3.4rem, 7vw, 6.2rem); line-height: 0.96; letter-spacing: 0; }
  .hero-copy p { max-width: 620px; margin: 16px 0 0; color: var(--text); font-size: clamp(1rem, 1.55vw, 1.22rem); }
  .trust-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px 28px; margin-top: 18px; color: var(--accent-dark); font-size: 0.92rem; font-weight: 820; }
  .hero-wave { position: absolute; inset: 0; z-index: 1; min-height: 100%; display: flex; align-items: center; justify-content: center; gap: clamp(10px, 1.25vw, 18px); opacity: 0.46; pointer-events: none; transform: scale(1.68); }
  .hero-wave i, .hero-wave .wave-dot, .hero-wave .wave-dash { display: block; border-radius: 999px; background: color-mix(in srgb, var(--accent) 52%, var(--line)); }
  .hero-wave i { width: clamp(5px, 0.55vw, 8px); height: calc(var(--h) * 1.55); background: color-mix(in srgb, var(--accent) 22%, var(--line)); }
  .hero-wave .wave-dot { width: clamp(18px, 1.9vw, 28px); height: clamp(18px, 1.9vw, 28px); }
  .hero-wave .wave-dash { width: clamp(86px, 8vw, 132px); height: clamp(14px, 1.2vw, 21px); background: var(--accent); }
  .hero-tool { margin-top: -60px; position: relative; z-index: 3; }
  .tool-card { border: 1px solid var(--line); border-radius: var(--radius); background: color-mix(in srgb, var(--surface) 94%, transparent); padding: clamp(20px, 3vw, 28px); }
  .translator-toolbar { display: flex; align-items: start; justify-content: space-between; gap: 20px; margin-bottom: 18px; }
  .translator-toolbar h2 { margin: 0; font-size: 1.2rem; line-height: 1.2; }
  .translator-toolbar p { margin: 7px 0 0; color: var(--muted); }
  .segmented { display: grid; grid-template-columns: 1fr 1fr; min-width: min(100%, 340px); border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; background: var(--surface-soft); }
  .segmented button { border: 0; padding: 11px 12px; background: transparent; color: var(--text); font-weight: 820; }
  .segmented button.active { background: var(--accent); color: white; }
  .translator-grid { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) 52px minmax(0, 1fr); gap: 22px; align-items: center; }
  .translator-panel { display: grid; gap: 8px; }
  .field-label { display: block; color: var(--accent-dark); font-weight: 850; font-size: 0.86rem; letter-spacing: 0; }
  textarea, .result-box { width: 100%; border: 1px solid var(--line-strong); border-radius: var(--radius); background: var(--surface-soft); color: var(--text); padding: 16px; }
  textarea { resize: vertical; outline: none; }
  .translator-panel textarea, .translator-panel .result-box { min-height: 156px; }
  .result-box { display: block; font-family: var(--mono); font-size: 1.05rem; white-space: pre-wrap; overflow-wrap: anywhere; }
  .panel-footer { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 38px; color: var(--muted); font-size: 0.9rem; }
  .panel-actions { justify-content: flex-end; flex-wrap: wrap; }
  .button { display: inline-flex; align-items: center; justify-content: center; min-height: 42px; padding: 0 16px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); color: var(--text); font-weight: 820; }
  .button.small { min-height: 36px; padding: 0 13px; font-size: 0.88rem; }
  .swap-button { width: 52px; height: 52px; border: 1px solid color-mix(in srgb, var(--accent) 34%, var(--line)); border-radius: 999px; background: var(--swap-bg); color: var(--swap-text); font-size: 0; box-shadow: 0 0 0 12px var(--swap-ring), 0 14px 28px rgba(6, 22, 63, 0.16); }
  .swap-button::before { content: "<>"; font-size: 1.05rem; font-weight: 900; letter-spacing: 0; }
  @media (max-width: 860px) {
    main { width: min(100% - 24px, 720px); }
    .site-header { grid-template-columns: 1fr auto; gap: 12px; padding: 12px; }
    .main-nav { grid-column: 1 / -1; justify-self: stretch; overflow-x: auto; gap: 18px; padding-bottom: 2px; }
    .main-nav a { padding: 4px 0 8px; }
    .hero-top { min-height: clamp(360px, 90vw, 430px); }
    .hero-wave { inset: 0 -18%; opacity: 0.34; transform: scale(1.22); }
    .hero-tool { margin-top: -34px; }
    .translator-grid { grid-template-columns: 1fr; }
    .translator-toolbar { display: block; }
    .segmented { margin-top: 14px; width: 100%; }
    .swap-button { justify-self: center; transform: rotate(90deg); }
  }
  @media (max-width: 520px) {
    body { background: var(--bg); }
    .brand span:last-child { max-width: 190px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .hero-copy h1 { font-size: clamp(2.85rem, 14vw, 4.4rem); }
    .translator-panel textarea, .translator-panel .result-box { min-height: 132px; }
  }
`, { loader: 'css', minify: true, legalComments: 'none' }).code.trim();

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const digits = '0123456789'.split('');
const punctuation = Object.keys(MORSE).filter((key) => !letters.includes(key) && !digits.includes(key));

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[char]));
}

function routeToFile(route) {
  const clean = route === '/' ? '' : route.replace(/^\/|\/$/g, '');
  return path.join(dist, clean, 'index.html');
}

function canonical(route) {
  return `${SITE.url}${route === '/' ? '/' : route}`;
}

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function write(route, html) {
  const file = routeToFile(route);
  ensureDir(file);
  fs.writeFileSync(file, minifyHtml(html));
}

function linkList(items, className = 'link-list') {
  return `<ul class="${className}">${items.map((item) => `
    <li><a href="${item.href}">${escapeHtml(item.label)}</a>${item.desc ? `<span>${escapeHtml(item.desc)}</span>` : ''}</li>
  `).join('')}</ul>`;
}

function emailParts() {
  const [user, domain] = SITE.email.split('@');
  return { user, domain, fallback: `${user} [at] ${domain}` };
}

function emailFallback() {
  return emailParts().fallback;
}

function emailInline() {
  const { user, domain, fallback } = emailParts();
  return `<span data-email-address data-email-user="${escapeHtml(user)}" data-email-domain="${escapeHtml(domain)}">${escapeHtml(fallback)}</span>`;
}

function emailAnchor(className = '') {
  const { user, domain, fallback } = emailParts();
  return `<a ${className ? `class="${escapeHtml(className)}" ` : ''}href="/contact/" data-email-link data-email-user="${escapeHtml(user)}" data-email-domain="${escapeHtml(domain)}">${escapeHtml(fallback)}</a>`;
}

function faq(items) {
  return `
    <section class="section faq-section" aria-labelledby="faq-heading">
      <div class="section-head">
        <h2 id="faq-heading">Frequently Asked Questions</h2>
      </div>
      <div class="faq-list">
        ${items.map((item, index) => `
          <details ${index === 0 ? 'open' : ''}>
            <summary>${escapeHtml(item.q)}</summary>
            <p>${escapeHtml(item.a)}</p>
          </details>
        `).join('')}
      </div>
    </section>
  `;
}

function breadcrumb(route, label) {
  if (route === '/') return '';
  const parts = route.replace(/^\/|\/$/g, '').split('/');
  let running = '';
  const crumbs = [{ href: '/', label: 'Home' }];
  for (const part of parts) {
    running += `/${part}`;
    const found = allPages.find((page) => page.route === `${running}/`);
    crumbs.push({ href: `${running}/`, label: found?.navLabel || found?.h1 || label || part.replaceAll('-', ' ') });
  }
  return `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      ${crumbs.map((item, index) => index === crumbs.length - 1
        ? `<span aria-current="page">${escapeHtml(item.label)}</span>`
        : `<a href="${item.href}">${escapeHtml(item.label)}</a><span aria-hidden="true">/</span>`).join('')}
    </nav>
  `;
}

function jsonLd(page, extra = []) {
  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: `${SITE.url}/`,
      name: SITE.name
    },
    {
      '@type': 'WebPage',
      '@id': `${canonical(page.route)}#webpage`,
      url: canonical(page.route),
      name: page.meta.title,
      description: page.meta.description,
      isPartOf: { '@id': `${SITE.url}/#website` }
    },
    ...extra
  ];

  if (page.route !== '/') {
    const routeParts = page.route.replace(/^\/|\/$/g, '').split('/');
    const itemListElement = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` }];
    let running = '';
    routeParts.forEach((part, index) => {
      running += `/${part}`;
      const match = allPages.find((entry) => entry.route === `${running}/`);
      itemListElement.push({
        '@type': 'ListItem',
        position: index + 2,
        name: match?.navLabel || match?.h1 || part.replaceAll('-', ' '),
        item: `${SITE.url}${running}/`
      });
    });
    graph.push({ '@type': 'BreadcrumbList', itemListElement });
  }

  if (page.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: page.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a }
      }))
    });
  }

  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>`;
}

function minifyHtml(html) {
  return html
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+$/gm, '')
    .trim();
}

function layout(page, body, extraJsonLd = []) {
  const themeColor = '#f7f9fd';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(page.meta.title)}</title>
  <meta name="description" content="${escapeHtml(page.meta.description)}">
  <meta name="robots" content="${page.indexable === false ? 'noindex,follow' : 'index,follow'}">
  <link rel="canonical" href="${canonical(page.route)}">
  <meta name="theme-color" content="${themeColor}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(page.meta.title)}">
  <meta property="og:description" content="${escapeHtml(page.meta.description)}">
  <meta property="og:url" content="${canonical(page.route)}">
  <meta property="og:site_name" content="${SITE.name}">
  <meta name="twitter:card" content="summary">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="${stylesheetHref}" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <style>${criticalCss}</style>
  <noscript><link rel="stylesheet" href="${stylesheetHref}"></noscript>
  ${jsonLd(page, extraJsonLd)}
  ${analyticsTag}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <a class="brand" href="/" aria-label="${SITE.name} home">
      <span class="brand-signal" aria-hidden="true"><i></i><b></b><i></i><b></b></span>
      <span>${SITE.name}</span>
    </a>
    <nav class="main-nav" aria-label="Primary">
      ${primaryNav.map((item) => `<a href="${item.href}">${item.label}</a>`).join('')}
    </nav>
    <button class="icon-button" type="button" data-theme-toggle aria-label="Toggle color theme">Theme</button>
  </header>
  <main id="main">
    ${breadcrumb(page.route, page.h1)}
    ${body}
  </main>
  <footer class="site-footer">
    <div>
      <a class="footer-brand" href="/">${SITE.name}</a>
      <p>Fast Morse tools, alphabet references, sounds, and practice pages.</p>
    </div>
    <div>
      <h2>Tools</h2>
      ${linkList(importantLinks.slice(0, 3))}
    </div>
    <div>
      <h2>Learn</h2>
      ${linkList([
        { href: '/morse-code-alphabet/', label: 'Alphabet' },
        { href: '/learn-morse-code/', label: 'Learning path' },
        { href: '/morse-code-practice/', label: 'Practice' },
        { href: '/international-morse-code/', label: 'International code' }
      ])}
    </div>
    <div>
      <h2>Trust</h2>
      ${linkList([
        { href: '/about/', label: 'About' },
        { href: '/contact/', label: 'Contact' },
        { href: '/privacy-policy/', label: 'Privacy Policy' },
        { href: '/terms/', label: 'Terms' },
        { href: '/sources/', label: 'Sources' },
        { href: '/sitemap/', label: 'Sitemap' }
      ])}
    </div>
    <p class="footer-line">© 2026 ${SITE.name}. Contact: ${emailAnchor()}</p>
  </footer>
  <script src="${appScriptHref}" defer></script>
</body>
</html>`;
}

function morseWave() {
  const bars = [18, 30, 54, 24, 68, 38, 22, 48, 76, 36, 26, 58, 34, 70, 42, 24, 52, 32, 64, 28, 46, 74, 38, 20, 44, 30];
  return `
    <div class="hero-wave" aria-hidden="true" data-wave>
      <span class="wave-dot"></span>
      <span class="wave-dash"></span>
      ${bars.map((height, index) => `<i style="--h:${height}px;--d:${index % 7}"></i>`).join('')}
      <span class="wave-dash"></span>
      <span class="wave-dot"></span>
    </div>
  `;
}

const heroHighlights = {
  '/': ['Live translation', 'Audio preview', 'Copy or download'],
  '/morse-code-alphabet/': ['Complete table', 'Play each symbol', 'Copy any code'],
  '/morse-code-decoder/': ['Decode dots and dashes', 'Spacing help', 'Readable output'],
  '/english-to-morse/': ['English input', 'Instant Morse output', 'Audio playback'],
  '/learn-morse-code/': ['Beginner path', 'Sound-based drills', 'Daily practice'],
  '/morse-code-practice/': ['Tap-and-hold key', 'Read or listen', 'Live sound feedback'],
  '/morse-code-meaning/': ['Plain explanation', 'Timing basics', 'Real examples'],
  '/international-morse-code/': ['Standard reference', 'Timing units', 'Prosign table'],
  '/morse-code-sounds/': ['Adjust WPM', 'Change tone', 'Download WAV'],
  '/about/': ['Tools overview', 'Reference approach', 'Feedback path'],
  '/contact/': ['Email support', 'Correction notes', 'Accessibility feedback'],
  '/privacy-policy/': ['Browser tools', 'Contact messages', 'Theme preference'],
  '/terms/': ['Tool use', 'Accuracy notes', 'Responsible use'],
  '/sources/': ['Reference links', 'Timing sources', 'Learning context'],
  '/sitemap/': ['Tools', 'Reference', 'Practice pages']
};

function hero(page, intro, tool = '') {
  const highlights = page.highlights || heroHighlights[page.route] || ['Useful tool', 'Clear examples', 'Fast actions'];
  return `
    <section class="hero ${tool ? 'hero-with-tool' : 'hero-plain'}">
      <div class="hero-top">
        <div class="hero-copy">
          <h1>${escapeHtml(page.h1)}</h1>
          <p>${escapeHtml(intro)}</p>
          <div class="trust-row" aria-label="Tool highlights">
            ${highlights.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}
          </div>
        </div>
        ${morseWave()}
      </div>
      ${tool ? `<div class="hero-tool">${tool}</div>` : ''}
    </section>
  `;
}

function converterCard({ id, mode = 'text-to-morse', title = 'Morse Code Translator', text = 'Type text or Morse code and get an instant result.' }) {
  const isDecode = mode === 'morse-to-text';
  return `
    <section class="tool-card translator-card" data-converter data-default-mode="${mode}" id="${id}">
      <div class="translator-toolbar">
        <div>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(text)}</p>
        </div>
        <div class="segmented" role="group" aria-label="Conversion direction">
          <button type="button" data-mode="text-to-morse" class="${isDecode ? '' : 'active'}">English → Morse</button>
          <button type="button" data-mode="morse-to-text" class="${isDecode ? 'active' : ''}">Morse → English</button>
        </div>
      </div>
      <div class="translator-grid">
        <div class="translator-panel">
          <label class="field-label" for="${id}-input" data-source-label>${isDecode ? 'Morse Code' : 'Text'}</label>
          <textarea id="${id}-input" data-input rows="6" maxlength="1200" placeholder="${isDecode ? 'Paste Morse code such as ... --- ...' : 'Type your text here...'}"></textarea>
          <div class="panel-footer">
            <span data-count>0 / 1200</span>
            <button class="button ghost small" type="button" data-clear>Clear</button>
          </div>
        </div>
        <button class="swap-button" type="button" data-swap aria-label="Swap conversion direction">Swap</button>
        <div class="translator-panel">
          <label class="field-label" for="${id}-output" data-result-label>${isDecode ? 'Text' : 'Morse Code'}</label>
          <output id="${id}-output" data-output class="result-box" aria-live="polite">${isDecode ? 'English text will appear here.' : 'Morse code will appear here.'}</output>
          <div class="panel-footer panel-actions">
            <button class="button secondary small" type="button" data-play>Play</button>
            <button class="button secondary small" type="button" data-copy>Copy</button>
            <button class="button secondary small" type="button" data-download>Download</button>
          </div>
        </div>
      </div>
      <p class="tool-error" data-error hidden></p>
      <div class="examples" aria-label="Examples">
        <span>Examples:</span>
        ${['SOS', 'HELLO', 'MORSE', '73', 'CQ CQ CQ'].map((sample) => `<button type="button" data-example="${sample}">${sample}</button>`).join('')}
      </div>
    </section>
  `;
}

function soundTool() {
  return `
    <section class="tool-card sound-tool" data-sound-tool>
      <div class="tool-card-head">
        <div>
          <h2>Morse Code Sound Player</h2>
          <p>Type text or Morse code, then play it with adjustable timing.</p>
        </div>
      </div>
      <label class="field-label" for="sound-input">Message</label>
      <textarea id="sound-input" data-sound-input rows="4">SOS</textarea>
      <div class="control-grid">
        <label>WPM <input type="range" min="8" max="28" value="18" data-wpm><span data-wpm-value>18</span></label>
        <label>Tone <input type="range" min="450" max="900" value="650" data-tone><span data-tone-value>650 Hz</span></label>
        <label class="check-row"><input type="checkbox" data-loop> Loop playback</label>
      </div>
      <output class="result-box" data-sound-output>... --- ...</output>
      <div class="progress" aria-hidden="true"><span data-progress></span></div>
      <div class="tool-actions">
        <button class="button primary" type="button" data-sound-play>Play Sound</button>
        <button class="button secondary" type="button" data-sound-copy>Copy Morse</button>
        <button class="button secondary" type="button" data-sound-download>Download WAV</button>
        <button class="button ghost" type="button" data-sound-stop>Stop</button>
      </div>
    </section>
  `;
}

function practiceTool() {
  return `
    <div class="practice-suite">
      <section class="tool-card practice-tool" data-practice>
        <div class="tool-card-head">
          <div>
            <h2>Practice Trainer</h2>
            <p>Answer ten quick questions and build recognition speed.</p>
          </div>
          <div class="segmented" role="group" aria-label="Practice mode">
            <button type="button" class="active" data-practice-mode="read">Read Morse</button>
            <button type="button" data-practice-mode="listen">Listen</button>
          </div>
        </div>
        <div class="practice-stage">
          <div>
            <span class="eyeless-label">Question</span>
            <output data-practice-prompt class="practice-prompt">.-</output>
          </div>
          <button class="button secondary" type="button" data-practice-play>Play</button>
        </div>
        <div class="answer-grid" data-practice-answers></div>
        <p class="feedback" data-practice-feedback aria-live="polite">Choose the matching character.</p>
        <div class="progress"><span data-practice-progress></span></div>
        <div class="score-row">
          <span>Score: <strong data-practice-score>0</strong>/10</span>
          <span>Streak: <strong data-practice-streak>0</strong></span>
          <label>WPM <input type="range" min="8" max="24" value="16" data-practice-wpm></label>
          <button class="button ghost small" type="button" data-practice-reset>Reset</button>
        </div>
      </section>
      ${keyerTool()}
    </div>
  `;
}

function keyerTool() {
  const bars = [18, 32, 52, 28, 64, 42, 24, 58, 36, 70, 30, 48, 62, 26];
  return `
    <section class="tool-card keyer-tool" data-keyer>
      <div class="tool-card-head">
        <div>
          <h2>Morse Key Practice</h2>
          <p>Press, hear the tone, and build your own Morse message.</p>
        </div>
        <span class="keyer-mode-pill">Mouse · Touch · Space</span>
      </div>
      <div class="keyer-console">
        <div class="keyer-meter" aria-hidden="true">
          ${bars.map((height, index) => `<i style="--h:${height}px;--d:${index % 5}"></i>`).join('')}
        </div>
        <button class="keyer-button" type="button" data-keyer-button aria-pressed="false">
          <span>Tap / Hold</span>
          <b data-keyer-live>Ready</b>
        </button>
      </div>
      <div class="keyer-output-grid">
        <label>
          <span>Raw Morse</span>
          <output class="keyer-code" data-keyer-code>Waiting for input</output>
        </label>
        <label>
          <span>Decoded Text</span>
          <output class="keyer-text" data-keyer-text>Waiting for input</output>
        </label>
      </div>
      <div class="control-grid keyer-controls">
        <label>Timing <strong data-keyer-wpm-value>16 WPM</strong><input type="range" min="8" max="24" value="16" data-keyer-wpm></label>
        <label>Tone <strong data-keyer-tone-value>650 Hz</strong><input type="range" min="420" max="900" step="10" value="650" data-keyer-tone></label>
      </div>
      <div class="tool-actions keyer-actions">
        <button class="button secondary small" type="button" data-keyer-letter>Letter Space</button>
        <button class="button secondary small" type="button" data-keyer-word>Word Space</button>
        <button class="button secondary small" type="button" data-keyer-play>Play Back</button>
        <button class="button secondary small" type="button" data-keyer-copy-code>Copy Morse</button>
        <button class="button secondary small" type="button" data-keyer-copy-text>Copy Text</button>
        <button class="button ghost small" type="button" data-keyer-clear>Clear</button>
      </div>
      <p class="feedback" data-keyer-status aria-live="polite">Ready for your first press.</p>
    </section>
  `;
}

function alphabetTable(chars, title) {
  return `
    <section class="section">
      <div class="section-head">
        <h2>${title}</h2>
      </div>
      <div class="alphabet-grid" data-alphabet-grid>
        ${chars.map((char) => {
          return `<article class="symbol-card" data-symbol-card data-symbol="${char}" data-morse="${MORSE[char]}">
            <strong>${escapeHtml(char)}</strong>
            <code>${MORSE[char]}</code>
            <div class="symbol-actions">
              <button type="button" data-play-morse="${MORSE[char]}">Play</button>
              <button type="button" data-copy-value="${MORSE[char]}">Copy</button>
            </div>
          </article>`;
        }).join('')}
      </div>
    </section>
  `;
}

function prosignTable() {
  return `
    <section class="section">
      <div class="section-head">
        <h2>Prosigns</h2>
        <p>Prosigns are compact Morse signals used to manage message flow.</p>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Prosign</th><th>Morse</th><th>Meaning</th><th>Actions</th></tr></thead>
          <tbody>
            ${PROSIGNS.map((item) => `<tr>
              <td><strong>${item.label}</strong></td>
              <td><code>${item.code}</code></td>
              <td>${item.meaning}</td>
              <td><button type="button" data-play-morse="${item.code}">Play</button> <button type="button" data-copy-value="${item.code}">Copy</button></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function related(items) {
  return `
    <section class="section related">
      <div class="section-head"><h2>Related Pages</h2></div>
      <div class="card-grid">
        ${items.map((item) => `<a class="info-card" href="${item.href}"><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.desc || '')}</span></a>`).join('')}
      </div>
    </section>
  `;
}

const commonFaq = [
  { q: 'What is Morse code?', a: 'Morse code is a way to write letters, numbers, and symbols with short signals called dots and longer signals called dashes.' },
  { q: 'How do I separate words in Morse code?', a: 'Letters are separated by spaces. Words are often separated by a slash or a longer pause.' },
  { q: 'Can I play Morse code as sound?', a: 'Yes. Use the play buttons on the translator, alphabet, sound, and practice pages.' }
];

function sectionTitle(title, link = '') {
  return `
    <div class="section-title">
      <h2>${title}</h2>
      ${link}
    </div>
  `;
}

function homeFeatureTiles() {
  const tiles = [
    { href: '/morse-code-alphabet/', label: 'Morse Code Alphabet', desc: 'View all letters, numbers and symbols.', mark: '.-' },
    { href: '/morse-code-sounds/', label: 'Morse Code Sounds', desc: 'Listen to Morse code with different speeds.', mark: '--' },
    { href: '/morse-code-decoder/', label: 'Morse Code Decoder', desc: 'Decode Morse code to text.', mark: '..' },
    { href: '/morse-code-practice/', label: 'Morse Code Practice', desc: 'Practice reading, listening, and key timing.', mark: '-.' },
    { href: '/learn-morse-code/', label: 'Learn Morse Code', desc: 'Build a simple daily learning routine.', mark: '.--' },
    { href: '/morse-code-meaning/', label: 'History and Reference', desc: 'Learn the meaning and use cases.', mark: '...' }
  ];
  return `
    <section class="feature-tiles" aria-label="Popular Morse code sections">
      ${tiles.map((item) => `
        <a class="feature-tile" href="${item.href}">
          <span class="tile-mark" aria-hidden="true">${item.mark}</span>
          <strong>${item.label}</strong>
          <span>${item.desc}</span>
        </a>
      `).join('')}
    </section>
  `;
}

function homeAlphabetPreview() {
  const chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'M', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  return `
    <section class="section home-strip">
      ${sectionTitle('Morse Code Alphabet', '<a href="/morse-code-alphabet/">View full alphabet</a>')}
      <div class="alphabet-strip">
        ${chars.map((char) => `<a href="/morse-code-alphabet/" aria-label="${char} in Morse code"><strong>${char}</strong><code>${MORSE[char]}</code></a>`).join('')}
      </div>
    </section>
  `;
}

function homeBenefits() {
  const benefits = [
    { title: 'Fast Conversion', desc: 'Translate text to Morse code and back in real time.', mark: '.-' },
    { title: 'Simple to Use', desc: 'Clean controls with no learning curve.', mark: '..' },
    { title: 'Private by Design', desc: 'The core tools run in your browser.', mark: '--' },
    { title: 'Mobile Friendly', desc: 'Works well on phones, tablets, and desktop.', mark: '-.' }
  ];
  return `
    <section class="section centered-section">
      <h2>Why Use This Tool?</h2>
      <div class="benefit-grid">
        ${benefits.map((item) => `
          <article class="benefit-card">
            <span class="tile-mark" aria-hidden="true">${item.mark}</span>
            <div><strong>${item.title}</strong><p>${item.desc}</p></div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function homeSteps() {
  const steps = [
    { title: 'Enter or Paste', desc: 'Type your text or paste Morse code.' },
    { title: 'Translate', desc: 'The result updates as you type.' },
    { title: 'Listen and Share', desc: 'Play the audio, copy, or download your result.' }
  ];
  return `
    <section class="section centered-section">
      <h2>How It Works</h2>
      <div class="step-grid">
        ${steps.map((item, index) => `
          <article class="step-card">
            <span>${index + 1}</span>
            <div><strong>${item.title}</strong><p>${item.desc}</p></div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function homePage(page) {
  const body = `
    ${hero(page, 'Translate text to Morse code and Morse code to text instantly. Listen to the sound, copy, and share with ease.', converterCard({ id: 'home-converter', title: 'Morse Code Translator' }))}
    ${homeFeatureTiles()}
    ${homeAlphabetPreview()}
    ${homeBenefits()}
    ${homeSteps()}
    ${faq(commonFaq)}
  `;
  return layout(page, body, [{ '@type': 'WebApplication', name: 'Morse Code Translator', applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any' }]);
}

function toolPage(page, mode) {
  const isDecode = mode === 'morse-to-text';
  const guide = isDecode ? {
    intro: 'Paste dots and dashes to decode Morse into readable English.',
    title: 'Morse to English Decoder',
    text: 'Use spaces between letters and / between words.',
    stepsTitle: 'How to Decode Morse',
    steps: [
      'Paste Morse code such as ... --- ... into the input area.',
      'Keep one space between letters and a slash between words.',
      'Read the decoded text and fix any unknown patterns shown below the tool.'
    ],
    sideTitle: 'Accepted Input',
    sideText: 'The decoder accepts dots, dashes, spaces, slashes, and common dash variants. A slash means a word break, so ... / --- is read as two groups.',
    extraTitle: 'Troubleshooting Decoded Text',
    extraCards: [
      ['Question marks', 'A question mark means one Morse group does not match a standard character. Check spacing first.'],
      ['Merged letters', 'If words look merged, add slashes between word groups before decoding again.'],
      ['Long signals', 'Replace long dash characters with a normal hyphen if a pasted message looks unusual.'],
      ['Fast checking', 'Use the alphabet page when you want to verify one pattern manually.']
    ],
    faq: [
      { q: 'What does a slash mean in Morse code?', a: 'A slash is commonly used in text form to show a word break.' },
      { q: 'Why do I see a question mark in the decoded result?', a: 'One group was not recognized as a standard Morse pattern. Most problems come from missing spaces between letters.' },
      { q: 'Can I decode SOS without slashes?', a: 'Yes. SOS is written as ... --- ... with spaces between the three letters.' }
    ],
    related: [
      { href: '/english-to-morse/', label: 'English to Morse', desc: 'Create Morse from ordinary text.' },
      { href: '/morse-code-alphabet/', label: 'Morse Code Alphabet', desc: 'Check each character pattern.' },
      { href: '/morse-code-sounds/', label: 'Morse Code Sounds', desc: 'Play the same message as audio.' }
    ]
  } : {
    intro: 'Type English text and translate it into Morse code with sound playback.',
    title: 'English to Morse Translator',
    text: 'Letters, numbers, and common punctuation are supported.',
    stepsTitle: 'How to Translate English',
    steps: [
      'Type a word, sentence, number, or short message in plain English.',
      'The Morse output updates immediately with spaces between letters.',
      'Copy the result, play it as sound, or download it as an audio file.'
    ],
    sideTitle: 'What Converts Well',
    sideText: 'Short messages, names, call signs, numbers, and common punctuation work best. Unsupported characters are skipped so the result stays readable.',
    extraTitle: 'Good English to Morse Examples',
    extraCards: [
      ['HELLO', 'A simple word for checking letter spacing and repeated L characters.'],
      ['CQ CQ CQ', 'A familiar radio-style call that is easy to hear in rhythm.'],
      ['73', 'A short numeric example often used in amateur radio contexts.'],
      ['MORSE CODE', 'A two-word message that shows why slashes matter in copied output.']
    ],
    faq: [
      { q: 'Can English punctuation be converted?', a: 'Common punctuation such as periods, commas, question marks, and slashes can be converted.' },
      { q: 'Why are there slashes in the Morse result?', a: 'A slash marks a word break so copied Morse stays readable in plain text.' },
      { q: 'Can I hear the Morse code after translating?', a: 'Yes. Use Play to hear the timing, or Download to save a WAV file.' }
    ],
    related: [
      { href: '/morse-code-decoder/', label: 'Morse Code Decoder', desc: 'Convert dots and dashes back to text.' },
      { href: '/morse-code-practice/', label: 'Morse Code Practice', desc: 'Practice with sound and key timing.' },
      { href: '/morse-code-sounds/', label: 'Morse Code Sounds', desc: 'Adjust speed and tone.' }
    ]
  };
  const body = `
    ${hero(page, guide.intro, converterCard({
      id: isDecode ? 'decoder' : 'encoder',
      mode,
      title: guide.title,
      text: guide.text
    }))}
    <section class="section columns">
      <div>
        <h2>${guide.stepsTitle}</h2>
        <ol class="steps">
          ${guide.steps.map((step) => `<li>${step}</li>`).join('')}
        </ol>
      </div>
      <div>
        <h2>${guide.sideTitle}</h2>
        <p>${guide.sideText}</p>
      </div>
    </section>
    <section class="section">
      <div class="section-head"><h2>${guide.extraTitle}</h2></div>
      <div class="card-grid">
        ${guide.extraCards.map(([title, desc]) => `<article class="info-card"><strong>${title}</strong><span>${desc}</span></article>`).join('')}
      </div>
    </section>
    ${related(guide.related)}
    ${faq(guide.faq)}
  `;
  return layout(page, body, [{ '@type': 'WebApplication', name: page.h1, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any' }]);
}

function alphabetPage(page) {
  const body = `
    ${hero(page, 'Browse letters, numbers, punctuation, and prosigns. Click any item to play or copy its Morse code.')}
    <section class="section">
      <label class="search-label" for="alphabet-search">Search the alphabet</label>
      <input id="alphabet-search" class="search-input" type="search" data-alphabet-search placeholder="Search A, 7, question mark, SOS...">
    </section>
    ${alphabetTable(letters, 'A-Z Letters')}
    ${alphabetTable(digits, 'Numbers 0-9')}
    ${alphabetTable(punctuation, 'Punctuation')}
    ${prosignTable()}
    ${faq([
      { q: 'What is A in Morse code?', a: 'A is dot dash, written as .-.' },
      { q: 'What is the Morse code for numbers?', a: 'Numbers use five-signal patterns, such as 1 as .---- and 0 as -----. ' },
      { q: 'Are prosigns the same as normal letters?', a: 'No. Prosigns are sent as special joined signals, even if their labels look like two letters.' }
    ])}
  `;
  return layout(page, body);
}

function meaningPage(page) {
  const body = `
    ${hero(page, 'Morse code means writing information with short and long signals instead of ordinary letters.')}
    <section class="section columns">
      <div>
        <h2>Simple Meaning</h2>
        <p>Morse code is a signal alphabet. Each letter, number, or symbol is represented by a pattern of dots and dashes. A dot is a short signal. A dash is a longer signal.</p>
        <p>For example, <code>S</code> is <code>...</code>, <code>O</code> is <code>---</code>, and <code>SOS</code> is <code>... --- ...</code>.</p>
      </div>
      <div class="answer-card">
        <span class="eyeless-label">Quick example</span>
        <p class="phrase-text">SOS</p>
        <code class="phrase-code">... --- ...</code>
        <button class="button secondary" type="button" data-play-morse="... --- ...">Play SOS</button>
      </div>
    </section>
    <section class="section">
      <h2>How Morse Code Works</h2>
      <div class="card-grid">
        <article class="info-card"><strong>Dot</strong><span>A short signal, usually one time unit.</span></article>
        <article class="info-card"><strong>Dash</strong><span>A longer signal, usually three time units.</span></article>
        <article class="info-card"><strong>Letter space</strong><span>A pause between character patterns.</span></article>
        <article class="info-card"><strong>Word space</strong><span>A longer pause, often written as a slash in text.</span></article>
      </div>
    </section>
    ${related([
      { href: '/morse-code-alphabet/', label: 'Morse Code Alphabet', desc: 'See every character.' },
      { href: '/international-morse-code/', label: 'International Morse Code', desc: 'Review standard signs.' },
      { href: '/learn-morse-code/', label: 'Learn Morse Code', desc: 'Start practicing.' }
    ])}
    ${faq([
      { q: 'Is Morse code a language?', a: 'It is better described as an encoding system. It can represent text from a language, but it is not a full spoken language by itself.' },
      { q: 'Why are dots and dashes useful?', a: 'They can be sent with sound, light, tapping, radio signals, or written text.' },
      { q: 'Is Morse code still used?', a: 'Yes, mainly for learning, amateur radio, signaling practice, and historical interest.' }
    ])}
  `;
  return layout(page, body);
}

function internationalPage(page) {
  const body = `
    ${hero(page, 'International Morse code is the standard dot-and-dash system used for letters, numbers, selected punctuation, and prosigns.')}
    <section class="section">
      <div class="section-head">
        <h2>International Morse Code Table</h2>
        <p>This reference groups the standard letters and numbers without changing the alphabet page into a duplicate page.</p>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Type</th><th>Characters</th><th>Example</th></tr></thead>
          <tbody>
            <tr><td>Letters</td><td>A through Z</td><td><code>A .-</code>, <code>Z --..</code></td></tr>
            <tr><td>Numbers</td><td>0 through 9</td><td><code>1 .----</code>, <code>0 -----</code></td></tr>
            <tr><td>Punctuation</td><td>Common marks</td><td><code>? ..--..</code>, <code>/ -..-.</code></td></tr>
            <tr><td>Prosigns</td><td>Message-control signs</td><td><code>AR .-.-.</code>, <code>SK ...-.-</code></td></tr>
          </tbody>
        </table>
      </div>
    </section>
    ${prosignTable()}
    <section class="section">
      <h2>Timing Units</h2>
      <p>A dot is one unit. A dash is three units. The gap inside a character is one unit. The gap between letters is three units. The gap between words is seven units.</p>
    </section>
    ${related([
      { href: '/morse-code-alphabet/', label: 'Alphabet table', desc: 'Interactive character cards.' },
      { href: '/morse-code-sounds/', label: 'Sound player', desc: 'Hear timing differences.' },
      { href: '/sources/', label: 'Sources', desc: 'Reference links used on this site.' }
    ])}
    ${faq([
      { q: 'Is International Morse code different from American Morse code?', a: 'Yes. International Morse code is the modern common reference. American Morse code used different timing and some different patterns.' },
      { q: 'What is a prosign?', a: 'A prosign is a procedural signal sent as one joined Morse pattern.' },
      { q: 'Why does spacing matter?', a: 'The same dots and dashes can be confusing if letter and word pauses are not clear.' }
    ])}
  `;
  return layout(page, body);
}

function soundsPage(page) {
  const body = `
    ${hero(page, 'Hear Morse code as beeps, adjust speed and tone, loop short messages, and download practice audio.', soundTool())}
    <section class="section">
      <div class="section-head"><h2>Sound Controls Explained</h2></div>
      <div class="card-grid">
        <article class="info-card"><strong>WPM</strong><span>Words per minute changes the length of dots, dashes, and pauses.</span></article>
        <article class="info-card"><strong>Tone</strong><span>Higher tones are sharper, while lower tones can feel easier during long practice sessions.</span></article>
        <article class="info-card"><strong>Loop</strong><span>Loop playback is useful for repeating one short word until the rhythm feels familiar.</span></article>
        <article class="info-card"><strong>WAV download</strong><span>Download a practice clip when you want to replay the same message offline.</span></article>
      </div>
    </section>
    <section class="section columns">
      <div>
        <h2>Sound Timing</h2>
        <p>Dots are short. Dashes are longer. Clear pauses between letters and words make the message easier to read by ear.</p>
      </div>
      <div>
        <h2>Good Practice Settings</h2>
        <p>Beginners often start around 12-16 WPM with a comfortable tone. Increase speed only after the patterns feel familiar.</p>
      </div>
    </section>
    ${related([
      { href: '/morse-code-practice/', label: 'Morse Code Practice', desc: 'Train with sound questions.' },
      { href: '/learn-morse-code/', label: 'Learn Morse Code', desc: 'Build a daily routine.' },
      { href: '/english-to-morse/', label: 'English to Morse', desc: 'Create a message before playing it.' }
    ])}
    ${faq([
      { q: 'What WPM should I use?', a: 'Start slow enough to hear each pattern clearly, then raise the speed gradually.' },
      { q: 'Can I download the Morse sound?', a: 'Yes. Use the Download WAV button after entering a message.' },
      { q: 'Why is the first play sometimes delayed?', a: 'Browsers start audio only after a user action, so the first click may initialize audio first.' }
    ])}
  `;
  return layout(page, body, [{ '@type': 'WebApplication', name: 'Morse Code Sound Player', applicationCategory: 'MultimediaApplication', operatingSystem: 'Any' }]);
}

function learnPage(page) {
  const body = `
    ${hero(page, 'Learn Morse code by grouping easy patterns, hearing the rhythm, and practicing a few minutes at a time.')}
    <section class="section">
      <div class="section-head"><h2>Beginner Learning Path</h2></div>
      <ol class="timeline">
        <li><strong>Start with simple letters.</strong><span>E is dot, T is dash, I is two dots, M is two dashes.</span></li>
        <li><strong>Add opposite pairs.</strong><span>Compare A and N, S and O, U and D.</span></li>
        <li><strong>Practice by sound.</strong><span>Use the sound player so patterns become rhythms, not just symbols.</span></li>
        <li><strong>Mix letters with words.</strong><span>Try short words such as ME, TO, SUN, RADIO, and CODE.</span></li>
        <li><strong>Review daily.</strong><span>Short sessions work better than one long session.</span></li>
      </ol>
    </section>
    <section class="section columns">
      <div class="answer-card">
        <span class="eyeless-label">Starter group</span>
        <p class="phrase-text">E T I M A N</p>
        <code class="phrase-code">. / - / .. / -- / .- / -.</code>
        <button class="button secondary" type="button" data-play-morse=". - .. -- .- -.">Play group</button>
      </div>
      <div>
        <h2>Daily Drill</h2>
        <p>Pick six characters. Listen to each one, write the answer, then check the alphabet. When you can answer without counting dots, add two more characters.</p>
        <a class="button primary" href="/morse-code-practice/">Open practice trainer</a>
      </div>
    </section>
    ${related([
      { href: '/morse-code-alphabet/', label: 'Alphabet', desc: 'Check every character.' },
      { href: '/morse-code-practice/', label: 'Practice', desc: 'Use quizzes.' },
      { href: '/morse-code-sounds/', label: 'Sounds', desc: 'Train by ear.' }
    ])}
    ${faq([
      { q: 'What is the fastest way to learn Morse code?', a: 'Learn by sound, not by visually counting dots and dashes. Short daily practice helps.' },
      { q: 'Should I learn letters or words first?', a: 'Start with letters, then use short words as soon as you know enough characters.' },
      { q: 'Do I need special equipment?', a: 'No. You can begin with the alphabet, sound player, and practice trainer in a browser.' }
    ])}
  `;
  return layout(page, body);
}

function practicePage(page) {
  const body = `
    ${hero(page, 'Practice Morse code with reading questions, listening questions, and a tap-and-hold key that plays sound while you enter dots and dashes.', practiceTool())}
    <section class="section">
      <div class="section-head"><h2>What to Practice First</h2></div>
      <div class="card-grid">
        <article class="info-card"><strong>E and T</strong><span>Start with the shortest patterns: one dot and one dash.</span></article>
        <article class="info-card"><strong>I and M</strong><span>Then compare two dots with two dashes so the rhythm contrast is clear.</span></article>
        <article class="info-card"><strong>A and N</strong><span>These opposite patterns help you stop counting and start recognizing shape.</span></article>
        <article class="info-card"><strong>S and O</strong><span>Use these before trying SOS so the distress rhythm makes sense.</span></article>
      </div>
    </section>
    <section class="section columns">
      <div>
        <h2>How Practice Works</h2>
        <p>Read mode shows a Morse pattern and asks for the matching character. Listen mode plays the sound first. Key practice lets you enter dots and dashes by timing each press.</p>
      </div>
      <div>
        <h2>Training Tip</h2>
        <p>Use the key trainer slowly at first. A short press becomes a dot, a longer press becomes a dash, and the decoded text updates as your spacing improves.</p>
      </div>
    </section>
    ${related([
      { href: '/learn-morse-code/', label: 'Learn Morse Code', desc: 'Use a structured path.' },
      { href: '/morse-code-sounds/', label: 'Morse Code Sounds', desc: 'Change speed and tone.' },
      { href: '/morse-code-alphabet/', label: 'Alphabet', desc: 'Review weak characters.' }
    ])}
    ${faq([
      { q: 'Can I practice on mobile?', a: 'Yes. The answer buttons and controls are sized for phone screens.' },
      { q: 'What happens after ten questions?', a: 'The progress bar completes. Press Reset to start another round.' },
      { q: 'Can I tap Morse code myself?', a: 'Yes. Use Morse Key Practice to press or hold the key, hear the tone, and see the decoded text update.' },
      { q: 'Should I use read mode or listen mode?', a: 'Use both. Read mode builds symbol familiarity, while listen mode builds real recognition.' }
    ])}
  `;
  return layout(page, body, [{ '@type': 'WebApplication', name: 'Morse Code Practice Trainer', applicationCategory: 'EducationalApplication', operatingSystem: 'Any' }]);
}

function sourcesPage(page) {
  const body = `
    ${hero(page, 'These references support the character tables, timing notes, historical context, and learning guidance on Morse Code Alphabet.')}
    <section class="section columns">
      <div>
        <h2>How References Are Used</h2>
        <p>The character tables follow standard International Morse code patterns. Learning notes and historical context are kept separate so reference pages do not become duplicate copies of each other.</p>
      </div>
      <div>
        <h2>What We Verify</h2>
        <p>Letters, numbers, selected punctuation, prosigns, and timing guidance are checked against recognized Morse code references before being summarized in plain language.</p>
      </div>
    </section>
    <section class="section">
      <div class="source-list">
        ${sourceLinks.map((item) => `<article class="source-card"><h2><a href="${item.href}" rel="noopener noreferrer">${item.label}</a></h2><p>${item.note}</p></article>`).join('')}
      </div>
    </section>
    ${related([
      { href: '/international-morse-code/', label: 'International Morse Code', desc: 'Standard reference page.' },
      { href: '/morse-code-alphabet/', label: 'Morse Code Alphabet', desc: 'Character table.' },
      { href: '/morse-code-meaning/', label: 'Morse Code Meaning', desc: 'Plain-language explanation.' }
    ])}
  `;
  return layout(page, body);
}

function legalPage(page, kind) {
  const isPrivacy = kind === 'privacy';
  const body = `
    ${hero(page, isPrivacy ? 'This policy explains the limited information involved when you use the tools or contact us.' : 'These terms explain acceptable use of the tools, references, and learning materials.')}
    <section class="section prose">
      ${isPrivacy ? `
        <h2>Tool Use</h2>
        <p>Converters, sound playback, alphabet buttons, and practice interactions run in your browser. The text you type into these tools is not submitted by the tool itself.</p>
        <h2>Contact Messages</h2>
        <p>If you email ${emailInline()}, your email address and message are used to read and respond to that message.</p>
        <h2>Local Preferences</h2>
        <p>The color theme may be stored in your browser so the page can remember your preference.</p>
        <h2>Analytics</h2>
        <p>Google Analytics may collect basic usage information such as page views and browser details. Text entered into the Morse tools is not sent by the tools for analytics.</p>
        <h2>Questions</h2>
        <p>For privacy questions, email ${emailAnchor()}.</p>
      ` : `
        <h2>Use of Tools</h2>
        <p>The converters, sound player, alphabet tables, and practice tools are provided for general learning and reference.</p>
        <h2>Learning and Reference Use</h2>
        <p>You may use the pages to check Morse patterns, compare timing, copy short examples, and practice recognition. Keep spacing intact when copying Morse code into another app.</p>
        <h2>Accuracy</h2>
        <p>The character tables are prepared from recognized Morse code references, but you should verify critical uses with the relevant standard or instructor.</p>
        <h2>Sound and Downloads</h2>
        <p>Audio playback and WAV downloads are generated from the text you enter in your browser. Timing can vary slightly by browser, device, and audio settings.</p>
        <h2>Responsible Use</h2>
        <p>Do not use Morse messages to mislead, harass, impersonate, or interfere with other people.</p>
        <h2>External References</h2>
        <p>Reference links may point to third-party websites. Those websites have their own content, policies, and availability.</p>
        <h2>Contact</h2>
        <p>Questions about these terms can be sent to ${emailAnchor()}.</p>
      `}
    </section>
  `;
  return layout(page, body);
}

function simplePage(page, content) {
  return layout(page, `${hero(page, content.intro)}${content.sections.map((section) => `
    <section class="section prose">
      <h2>${section.title}</h2>
      ${section.body}
    </section>
  `).join('')}`);
}

function sitemapPage(page) {
  const grouped = [
    ['Tools', allPages.filter((item) => ['/morse-code-decoder/', '/english-to-morse/', '/morse-code-sounds/'].includes(item.route))],
    ['Reference', allPages.filter((item) => item.route.includes('alphabet') || ['/morse-code-meaning/', '/international-morse-code/', '/sources/'].includes(item.route))],
    ['Learn', allPages.filter((item) => ['/learn-morse-code/', '/morse-code-practice/'].includes(item.route))],
    ['Trust', allPages.filter((item) => ['/about/', '/contact/', '/privacy-policy/', '/terms/', '/sitemap/'].includes(item.route))]
  ];
  const body = `
    ${hero(page, 'Browse every available page on Morse Code Alphabet.')}
    ${grouped.map(([title, items]) => `
      <section class="section">
        <h2>${title}</h2>
        ${linkList(items.map((item) => ({ href: item.route, label: item.navLabel || item.h1, desc: item.meta.description })))}
      </section>
    `).join('')}
  `;
  return layout(page, body);
}

const basePages = [
  { route: '/', h1: 'Morse Code Translator', navLabel: 'Home', meta: pageMeta['/'], render: homePage, faq: commonFaq },
  { route: '/morse-code-alphabet/', h1: 'Morse Code Alphabet', navLabel: 'Morse Code Alphabet', meta: pageMeta['/morse-code-alphabet/'], render: alphabetPage },
  { route: '/morse-code-decoder/', h1: 'Morse Code Decoder', navLabel: 'Morse Code Decoder', meta: pageMeta['/morse-code-decoder/'], render: (page) => toolPage(page, 'morse-to-text') },
  { route: '/english-to-morse/', h1: 'English to Morse', navLabel: 'English to Morse', meta: pageMeta['/english-to-morse/'], render: (page) => toolPage(page, 'text-to-morse') },
  { route: '/learn-morse-code/', h1: 'Learn Morse Code', navLabel: 'Learn Morse Code', meta: pageMeta['/learn-morse-code/'], render: learnPage },
  { route: '/morse-code-practice/', h1: 'Morse Code Practice', navLabel: 'Morse Code Practice', meta: pageMeta['/morse-code-practice/'], render: practicePage },
  { route: '/morse-code-meaning/', h1: 'Morse Code Meaning', navLabel: 'Morse Code Meaning', meta: pageMeta['/morse-code-meaning/'], render: meaningPage },
  { route: '/international-morse-code/', h1: 'International Morse Code', navLabel: 'International Morse Code', meta: pageMeta['/international-morse-code/'], render: internationalPage },
  { route: '/morse-code-sounds/', h1: 'Morse Code Sounds', navLabel: 'Morse Code Sounds', meta: pageMeta['/morse-code-sounds/'], render: soundsPage },
  { route: '/about/', h1: 'About Morse Code Alphabet', navLabel: 'About', meta: pageMeta['/about/'], indexable: false, render: (page) => simplePage(page, {
    intro: 'Morse Code Alphabet brings together practical Morse conversion, sound playback, reference tables, and practice tools.',
    sections: [
      { title: 'What You Can Do Here', body: '<p>Convert English to Morse, decode Morse to English, play dot-and-dash sounds, browse the alphabet, and practice recognition.</p>' },
      { title: 'Reference Approach', body: '<p>Character tables and timing notes are based on recognized Morse code references and are written for clear everyday use.</p>' },
      { title: 'Feedback', body: `<p>Corrections and accessibility notes can be sent to ${emailAnchor()}.</p>` }
    ]
  }) },
  { route: '/contact/', h1: 'Contact Morse Code Alphabet', navLabel: 'Contact', meta: pageMeta['/contact/'], indexable: false, render: (page) => simplePage(page, {
    intro: `For questions, corrections, or accessibility feedback, email ${emailFallback()}.`,
    sections: [
      { title: 'Email', body: `<p>${emailAnchor('button primary')}</p>` },
      { title: 'Helpful Details', body: '<p>If you found a character or tool issue, include the page URL and what you were checking.</p>' }
    ]
  }) },
  { route: '/privacy-policy/', h1: 'Privacy Policy', navLabel: 'Privacy Policy', meta: pageMeta['/privacy-policy/'], indexable: false, render: (page) => legalPage(page, 'privacy') },
  { route: '/terms/', h1: 'Terms of Use', navLabel: 'Terms', meta: pageMeta['/terms/'], render: (page) => legalPage(page, 'terms') },
  { route: '/sources/', h1: 'Morse Code Sources', navLabel: 'Sources', meta: pageMeta['/sources/'], render: sourcesPage },
  { route: '/sitemap/', h1: 'Sitemap', navLabel: 'Sitemap', meta: pageMeta['/sitemap/'], render: sitemapPage }
];

const allPages = [...basePages];

function minifyAsset(source, loader) {
  return transformSync(source, {
    loader,
    minify: true,
    target: loader === 'js' ? 'es2019' : undefined,
    legalComments: 'none'
  }).code.trim();
}

function llmsText() {
  const publicPages = allPages.filter((page) => page.indexable !== false);
  const pageLines = publicPages.map((page) => `- [${page.navLabel || page.h1}](${canonical(page.route)}): ${page.meta.description}`);
  const sourceLines = sourceLinks.map((item) => `- [${item.label}](${item.href}): ${item.note}`);

  return [
    '# Morse Code Alphabet',
    '',
    '> Fast browser-based Morse code translation, alphabet references, sound playback, and practice tools.',
    '',
    '## Primary Pages',
    '',
    ...pageLines,
    '',
    '## Reference Sources',
    '',
    ...sourceLines,
    '',
    '## Usage Notes',
    '',
    '- The translator and practice tools run in the browser.',
    '- The character tables follow standard International Morse code patterns.',
    '- Use the source pages for verification when exact operating rules matter.',
    ''
  ].join('\n');
}

function copyAssets() {
  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(path.join(dist, 'assets'), { recursive: true });
  fs.writeFileSync(
    path.join(dist, 'assets', 'styles.css'),
    minifyAsset(fs.readFileSync(path.join(root, 'src', 'styles.css'), 'utf8'), 'css')
  );
  fs.writeFileSync(
    path.join(dist, 'assets', 'app.js'),
    minifyAsset(fs.readFileSync(path.join(root, 'src', 'app.js'), 'utf8'), 'js')
  );
  fs.writeFileSync(path.join(dist, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0f5fff"/><circle cx="20" cy="32" r="6" fill="#fff"/><path d="M34 32h16" stroke="#fff" stroke-width="8" stroke-linecap="round"/></svg>`);
}

function writeRobotsAndSitemaps() {
  const sitemapPages = allPages.filter((page) => page.indexable !== false);
  const urls = sitemapPages.map((page) => `  <url><loc>${canonical(page.route)}</loc></url>`).join('\n');
  fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE.url}/sitemap.xml\n`);
  fs.writeFileSync(path.join(dist, 'llms.txt'), llmsText());
  fs.writeFileSync(path.join(dist, '_headers'), `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: microphone=(), camera=(), geolocation=()\n  Cache-Control: public, max-age=0, must-revalidate, no-transform\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n/favicon.svg\n  Cache-Control: public, max-age=604800\n/llms.txt\n  Content-Type: text/plain; charset=utf-8\n  Cache-Control: public, max-age=3600\n`);
  fs.writeFileSync(path.join(dist, '_redirects'), [
    '/morse-decoder/ /morse-code-decoder/ 301',
    '/mors-decoder/ /morse-code-decoder/ 301',
    '/morse-to-english/ /morse-code-decoder/ 301',
    '/morse-code-to-english/ /morse-code-decoder/ 301',
    '/morse-encoder/ /english-to-morse/ 301',
    '/text-to-morse/ /english-to-morse/ 301',
    '/alphabet-to-morse-code/ /english-to-morse/ 301',
    '/morse-alphabet/ /morse-code-alphabet/ 301',
    '/morse-code-letters/ /morse-code-alphabet/ 301',
    '/morse-code-alphabet/:slug/ /morse-code-alphabet/ 301',
    '/what-is-morse-code/ /morse-code-meaning/ 301',
    '/morse-meaning/ /morse-code-meaning/ 301',
    '/morse-sound/ /morse-code-sounds/ 301',
    '/morse-code-audio/ /morse-code-sounds/ 301',
    '/i-love-you-in-morse-code/ /english-to-morse/ 301',
    '/help-in-morse-code/ /english-to-morse/ 301',
    '/morse-code-texting/ /english-to-morse/ 301',
    '/i-love-you-morse/ /english-to-morse/ 301',
    ''
  ].join('\n'));
}

copyAssets();
for (const page of allPages) {
  write(page.route, page.render(page));
}
writeRobotsAndSitemaps();
console.log(`Built ${allPages.length} pages into ${dist}`);
