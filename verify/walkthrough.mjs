import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

async function loadChromium() {
  for (const spec of ['playwright', 'playwright-core', '@playwright/test']) {
    try { return (await import(spec)).chromium; } catch { /* next */ }
  }
  try {
    const root = execSync('npm root -g', { encoding: 'utf8' }).trim();
    for (const name of ['playwright', 'playwright-core']) {
      const entry = join(root, name, 'index.mjs');
      if (existsSync(entry)) return (await import(pathToFileURL(entry).href)).chromium;
    }
  } catch { /* fall through */ }
  console.error('Playwright not installed. Run:  npm install --no-save playwright');
  process.exit(2);
}

const chromium = await loadChromium();
const BASE = process.env.MEDA_URL || 'http://localhost:4173';
const SHOTS = new URL('./screenshots/', import.meta.url).pathname;
mkdirSync(SHOTS, { recursive: true });

const results = [];
const check = (n, ok, d = '') => { results.push({ n, ok, d }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${n}${d ? ' — ' + d : ''}`); };

const browser = await chromium.launch();
// Target viewport from the brief: must work at 1366x768 without horizontal scroll.
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });

const noOverflow = async () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth <= 0);

/* ---------- Shell ---------- */
check('app starts on Library', await page.getByRole('heading', { name: 'Find support that fits you.' }).isVisible());
check('persistent prototype badge present', await page.getByText('Interactive prototype · Sample data').isVisible());
check('no top header bar (annotation 1)', await page.evaluate(() => !document.querySelector('header, .topbar')));
check('Reset demo is in the sidebar, not a header', await page.evaluate(() => !!document.querySelector('.sidebar .btn-reset')));
const sidebarText = await page.locator('.sidebar').innerText();
check('no "Talk with a person" card in sidebar (annotation 2)', !/talk with a person/i.test(sidebarText), sidebarText.replace(/\n/g, ' | '));
check('sidebar has exactly Library / Assistant / Saved', (await page.locator('.sidebar .nav button').count()) === 3);
await page.screenshot({ path: `${SHOTS}/01-library-learn.png` });

/* ---------- Annotation 4: monochrome ---------- */
const hues = await page.evaluate(() => {
  const out = new Set();
  for (const el of document.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    for (const prop of ['color', 'backgroundColor', 'borderTopColor', 'borderLeftColor']) {
      const m = cs[prop].match(/rgba?\((\d+), (\d+), (\d+)/);
      if (!m) continue;
      const [r, g, b] = [ +m[1], +m[2], +m[3] ];
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      if (max - min > 24) out.add(`${cs[prop]} on ${el.tagName}.${el.className}`);
    }
  }
  return [...out];
});
check('theme is black and white — no saturated colour (annotation 4)', hues.length === 0, hues.slice(0, 3).join(' ; '));

/* ---------- Learn tab ---------- */
check('Learn shows six resource cards', (await page.locator('#panel-learn .card').count()) === 6);
await page.locator('#library-search').fill('assessment');
check('search filters the active tab', (await page.locator('#panel-learn .card').count()) < 6);
check('result count is announced', (await page.locator('.result-count').innerText()).includes('filters applied'));
await page.locator('#library-search').fill('zzzzzz');
check('empty state appears for no matches', await page.getByRole('heading', { name: 'No matches' }).isVisible());
await page.getByRole('button', { name: 'Clear search and filters' }).click();
check('clear filters restores all six', (await page.locator('#panel-learn .card').count()) === 6);

/* ---------- Resource drawer ---------- */
await page.locator('#panel-learn .card').first().click();
check('resource drawer opens', await page.getByRole('dialog').isVisible());
const resDrawer = await page.getByRole('dialog').innerText();
check('drawer shows summary, source link and scope', /source/i.test(resDrawer) && /how far this applies/i.test(resDrawer) && resDrawer.includes('https://'));
check('content labelled as prototype summary', resDrawer.includes('Prototype summary based on public guidance'));
// Exclude the disclaimer line, which legitimately uses these words to deny them.
const resNoDisclaimer = resDrawer.split('\n').filter((l) => !/not reviewed by a clinician/.test(l)).join('\n');
check('no invented reviewer, credential or endorsement', !/reviewed by|endorsed by|certified by|Dr\.|MD\b/i.test(resNoDisclaimer));
await page.screenshot({ path: `${SHOTS}/02-resource-drawer.png` });

/* ---------- Drawer accessibility ---------- */
check('focus moves into the drawer', await page.evaluate(() => document.activeElement?.id === 'drawer-title'));
await page.keyboard.press('Escape');
check('Escape closes the drawer', (await page.getByRole('dialog').count()) === 0);
check('focus returns to the opening card', await page.evaluate(() => document.activeElement?.classList.contains('card')));

/* ---------- Ask about this resource ---------- */
await page.locator('#panel-learn .card').first().click();
await page.getByRole('button', { name: 'Ask about this resource' }).click();
check('"Ask about this resource" opens a scripted answer in Assistant', await page.getByRole('heading', { name: 'Assistant', level: 1 }).isVisible());
const askLog = await page.locator('.chat-log').innerText();
check('assistant reply is present and labelled scripted', askLog.includes('Scripted assistant demo') && askLog.length > 200);

/* ---------- Path 1 ---------- */
await page.getByRole('button', { name: 'Reset demo' }).click();
await page.getByRole('button', { name: 'Assistant' }).first().click();
check('assistant opens with the brief\'s question', await page.getByText('What would you like help exploring today?').isVisible());
check('four starter options', (await page.locator('.chat-options .btn').count()) === 4);
await page.getByRole('button', { name: 'Could my difficulties be related to ADHD?' }).click();
const p1 = await page.locator('.chat-log').innerText();
check('path 1 reply is the exact non-diagnostic wording', p1.includes('This conversation cannot determine whether you have ADHD'));
check('path 1 offers three routes', p1.includes('Learn more') && p1.includes('Find professional support') && p1.includes('Explore practical support'));
await page.getByRole('button', { name: 'Learn more' }).click();
check('Learn more surfaces resource cards in the related panel', (await page.locator('.related .card').count()) === 2);
await page.getByRole('button', { name: 'Find professional support' }).last().click();
check('asks the user to choose a sample area', await page.getByText(/Which area would you like to look at/).isVisible());
await page.getByRole('button', { name: 'Central area' }).click();
check('area choice shows the matching listing', (await page.locator('.related .card').count()) === 1);
await page.locator('.related .card').first().click();
check('chat recommendation opens the same library drawer', await page.getByRole('dialog').isVisible());
const provDrawer = await page.getByRole('dialog').innerText();
check('provider drawer has intended service, questions and sample enquiry', provDrawer.includes('Questions to ask') && provDrawer.includes('Sample enquiry'));
check('sample enquiry states nothing is transmitted', /does not send anything|no transmission/i.test(provDrawer));
await page.screenshot({ path: `${SHOTS}/03-path1-provider.png` });
await page.keyboard.press('Escape');

/* ---------- Real listings ---------- */
await page.getByRole('button', { name: 'Library' }).first().click();
await page.getByRole('tab', { name: 'Professional support' }).click();
const provPanel = await page.locator('#panel-providers').innerText();
check('directory lists the two real organisations (annotation 3)', provPanel.includes('tamlyhoasung.com') && provPanel.includes('bvdaihoc.com.vn'));
check('real listings are labelled as unverified', provPanel.includes('Real organisation · details not verified'));
check('sample listings still labelled fictional', provPanel.includes('Fictional listing'));
await page.locator('#card-prov-tamlyhoasung').click();
const realDrawer = await page.getByRole('dialog').innerText();
check('real listing invents no area/service/format', (realDrawer.match(/To be confirmed from the official website/g) || []).length >= 3);
check('real listing states no partnership', /no relationship or partnership/i.test(realDrawer));
check('real listing links to the official site', await page.getByRole('link', { name: 'Open official website' }).isVisible());
check('no fabricated phone number', !/\+?\d[\d\s().-]{7,}/.test(realDrawer));
await page.screenshot({ path: `${SHOTS}/04-real-listing.png` });
await page.keyboard.press('Escape');

/* ---------- Provider filters ---------- */
await page.locator('#f-area').selectOption('north');
check('area filter narrows the directory', (await page.locator('#panel-providers .card').count()) === 1);
await page.locator('#f-format').selectOption('online');
check('combined filters can produce an empty state', await page.getByRole('heading', { name: 'No matches' }).isVisible());
await page.getByRole('button', { name: 'Clear search and filters' }).click();
check('clear restores all four listings', (await page.locator('#panel-providers .card').count()) === 4);

/* ---------- Sensory pantry ---------- */
await page.getByRole('tab', { name: 'Sensory pantry' }).click();
check('pantry shows six options', (await page.locator('#panel-sensory .card').count()) === 6);
const senPanel = await page.locator('#panel-sensory').innerText();
check('workplace adjustment is distinguished from products', senPanel.includes('Workplace adjustment · not a product'));
check('no price, rating or efficacy claim', !/\$|₫|★|rating|clinically proven|effective for/i.test(senPanel));
await page.locator('#card-sen-headphones').click();
const senDrawer = await page.getByRole('dialog').innerText();
check('product drawer shows example vendor and availability', /example vendor/i.test(senDrawer) && /availability not connected/i.test(senDrawer));
check('preference framing, not diagnosis framing', /some people|others|prefer/i.test(senDrawer) && !/because you have|recommended for (adhd|you)|suitable for people with/i.test(senDrawer));
await page.screenshot({ path: `${SHOTS}/05-sensory-drawer.png` });

/* ---------- Saving ---------- */
await page.getByRole('button', { name: 'Save', exact: true }).click();
check('save confirms', await page.getByText(/^Saved “/).isVisible());
await page.keyboard.press('Escape');
await page.locator('#card-sen-headphones').click();
check('re-opening shows it already saved (no duplicate)', await page.getByRole('button', { name: /Saved ✓/ }).isVisible());
await page.keyboard.press('Escape');
await page.getByRole('button', { name: /^Saved/ }).first().click();
check('Saved section lists the item once', (await page.locator('.saved-row').count()) === 1);
check('saved count badge shows 1', (await page.locator('.nav-count').innerText()) === '1');

/* ---------- Path 2 and the draft ---------- */
await page.getByRole('button', { name: 'Assistant' }).first().click();
await page.getByRole('button', { name: 'Noise at work makes it hard to focus.' }).click();
check('path 2 asks the brief\'s exact question', await page.getByText('Would you prefer to explore a quieter workspace, noise-reducing tools, or both?').isVisible());
await page.getByRole('button', { name: 'Both' }).click();
check('path 2 offers three relevant options including the workplace one', (await page.locator('.related .card').count()) === 3);
await page.getByRole('button', { name: 'Draft a support request' }).first().click();
check('draft opens', await page.getByRole('dialog').isVisible());
const seeded = await page.locator('#draft-text').inputValue();
check('draft is seeded with the brief\'s wording', seeded.startsWith('Background conversations make it difficult for me to follow my work.'));
await page.locator('#draft-text').fill(seeded + ' I could try this for two weeks.');
check('draft is editable', (await page.locator('#draft-text').inputValue()).includes('two weeks'));
check('draft states nothing is sent', /no way to send it|does not simulate anyone approving/i.test(await page.getByRole('dialog').innerText()));
check('no send or submit control exists', await page.evaluate(() => ![...document.querySelectorAll('button')].some((b) => /^(send request|submit|send to manager)/i.test(b.textContent.trim()))));
await page.screenshot({ path: `${SHOTS}/06-draft.png` });
await page.getByRole('button', { name: 'Save to this session' }).click();
await page.getByRole('button', { name: /^Saved/ }).first().click();
const savedList = await page.locator('.saved-list').innerText();
check('draft appears in Saved alongside the sensory option', savedList.includes('Support request draft') && (await page.locator('.saved-row').count()) === 2, savedList.replace(/\n/g, ' | '));

/* ---------- Practical support without diagnosis ---------- */
await page.getByRole('button', { name: 'Reset demo' }).click();
await page.getByRole('button', { name: 'Assistant' }).first().click();
await page.getByRole('button', { name: 'Show me sensory support options.' }).click();
check('practical support reachable without the diagnosis path', await page.getByText(/no need to discuss diagnosis first/i).isVisible());

/* ---------- Free text fallback ---------- */
await page.locator('#chat-text').fill('what is the capital of France');
await page.getByRole('button', { name: 'Send' }).click();
check('unsupported free text gets the honest fallback', await page.getByText('This prototype demonstrates a few guided conversations. Choose a topic below to continue.').isVisible());
check('fallback re-offers the starter options', (await page.locator('.chat-options .btn').last().isVisible()));
await page.locator('#chat-text').fill('the office is too noisy');
await page.getByRole('button', { name: 'Send' }).click();
check('supported free text routes to a real path', await page.getByText('Would you prefer to explore a quieter workspace, noise-reducing tools, or both?').isVisible());

/* ---------- Reset ---------- */
await page.getByRole('button', { name: 'Reset demo' }).click();
check('reset returns to Library', await page.getByRole('heading', { name: 'Find support that fits you.' }).isVisible());
await page.getByRole('button', { name: 'Saved' }).first().click();
check('reset cleared saved items', await page.getByRole('heading', { name: 'Nothing saved yet.' }).isVisible());

/* ---------- Saved empty state ---------- */
await page.getByRole('button', { name: 'Back to the library' }).click();
check('empty state returns to the library', await page.getByRole('heading', { name: 'Find support that fits you.' }).isVisible());

/* ---------- Claims audit across every screen ---------- */
const claims = [];
for (const [section, tab] of [['library', 'Learn'], ['library', 'Professional support'], ['library', 'Sensory pantry']]) {
  await page.getByRole('button', { name: 'Library' }).first().click();
  await page.getByRole('tab', { name: tab }).click();
  claims.push(await page.locator('#main').innerText());
}
await page.getByRole('button', { name: 'Assistant' }).first().click();
claims.push(await page.locator('#main').innerText());
const all = claims.join('\n');
check('never claims anonymity', !/anonymous|anonymity/i.test(all));
check('never claims clinical validation or certification', !/clinically validated|medically certified|accredited/i.test(all));
check('never claims a real partnership', !/our partner|partnered with|in partnership/i.test(all));
check('no booking or appointment confirmation', !/appointment (confirmed|available)|book now|booking confirmed/i.test(all));

/* ---------- Accessibility & viewport ---------- */
const fresh = await browser.newPage({ viewport: { width: 1366, height: 768 } });
await fresh.goto(`${BASE}/`, { waitUntil: 'networkidle' });
await fresh.keyboard.press('Tab');
check('first Tab reaches the skip link', await fresh.evaluate(() => document.activeElement?.className?.includes('skip-link')));
await fresh.keyboard.press('Enter');
check('skip link moves focus to main', await fresh.evaluate(() => document.activeElement?.id === 'main'));
await fresh.close();

const a11y = await page.evaluate(() => {
  const unlabelled = [...document.querySelectorAll('input, select, textarea')].filter((c) => {
    if (c.getAttribute('aria-label') || c.getAttribute('aria-labelledby')) return false;
    if (c.id && document.querySelector(`label[for="${CSS.escape(c.id)}"]`)) return false;
    return !c.closest('label');
  }).map((c) => c.id || c.tagName);
  const iconOnly = [...document.querySelectorAll('button')].filter((b) => {
    const t = (b.textContent || '').trim();
    return t.length <= 2 && !b.getAttribute('aria-label');
  }).map((b) => b.className);
  return { unlabelled, iconOnly, h1: document.querySelectorAll('h1').length };
});
check('every input is labelled', a11y.unlabelled.length === 0, a11y.unlabelled.join(','));
check('every icon-only button has an accessible name', a11y.iconOnly.length === 0, a11y.iconOnly.join(','));
check('exactly one h1 per screen', a11y.h1 === 1, String(a11y.h1));
check('no horizontal scroll at 1366x768', await noOverflow());

await page.setViewportSize({ width: 1440, height: 900 });
check('no horizontal scroll at 1440x900', await noOverflow());
await page.setViewportSize({ width: 683, height: 768 });
check('reflows at 683px (200% zoom of 1366)', await noOverflow());
await page.setViewportSize({ width: 1366, height: 768 });
await page.screenshot({ path: `${SHOTS}/07-assistant.png`, fullPage: true });

check('no uncaught page errors', errors.length === 0, errors.slice(0, 3).join(' | '));

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) { console.log('FAILURES:'); failed.forEach((f) => console.log(' - ' + f.n + (f.d ? ': ' + f.d : ''))); process.exit(1); }
