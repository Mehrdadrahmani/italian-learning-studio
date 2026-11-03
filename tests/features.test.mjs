// Leitner rules, three languages, theme switch, dictionary and translation.
import { webkit, devices } from 'playwright';
import { spawn } from 'node:child_process';
import { build } from 'esbuild';
const fails = [], ok = (c, m) => { console.log((c ? '  ok  ' : 'FAIL  ') + m); if (!c) fails.push(m); };
const code = (await build({ entryPoints: ['src/lib/leitner.ts'], bundle: true, write: false, format: 'esm' })).outputFiles[0].text;
const L = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
const now = new Date(2026, 10, 3, 15).getTime(), DAY = 864e5;
let c = L.newCard(now); ok(c.box === 1 && c.due <= now, 'new card is box 1 and due');
c = L.answer(c, true, now); ok(c.box === 2 && c.due > now, 'right moves to box 2');
ok(Math.round((c.due - new Date(2026, 10, 3).getTime()) / DAY) === 2, 'box 2 returns in 2 days');
c = L.answer(c, false, now); ok(c.box === 1, 'wrong returns to box 1');
for (let i = 0; i < 5; i++) c = L.answer(c, true, now);
ok(c.box === L.MASTERED, 'five rights reach mastered');
ok(L.dueCards({ a: { box: 3, due: 0, last: 0 }, b: { box: 1, due: 0, last: 0 }, m: c }, now).join() === 'b,a', 'lowest box first, mastered excluded');
const srv = spawn('node', ['scripts/serve.mjs'], { env: { ...process.env, PORT: '4197' } });
process.on('exit', () => srv.kill()); await new Promise(r => srv.stdout.once('data', r));
const browser = await webkit.launch();
const ctx = await browser.newContext({ ...devices['iPhone 13'] });
const page = await ctx.newPage();
page.on('pageerror', e => { if (!/googleapis/.test(e.message)) ok(false, 'pageerror ' + e.message); });
await page.goto('http://localhost:4197/');
const tab = t => page.locator('.tab').nth(t).click();
const openMore = async n => { await tab(4); await page.locator('.main .row').nth(n).click(); await page.waitForTimeout(30); };
// theme
const theme = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
const t1 = await theme(); await page.locator('.icon-btn.end').click(); await page.waitForTimeout(50); const t2 = await theme();
await page.locator('.icon-btn.end').click(); await page.waitForTimeout(50); const t3 = await theme();
ok(t1 !== t2 && t2 !== t3, `header toggle switches dark and light (${t1} > ${t2} > ${t3})`);
// leitner flow
await openMore(10); ok((await page.locator('h1').innerText()) === 'لایتنر', 'Leitner opens');
await page.getByRole('button', { name: 'افزودن ۱۰ واژهٔ تازه' }).click(); await page.waitForTimeout(40);
await page.locator('.flash').click(); await page.getByRole('button', { name: 'بلد بودم' }).click();
await page.locator('.flash').click(); await page.getByRole('button', { name: 'بلد نبودم' }).click();
const st = await page.evaluate(() => JSON.parse(localStorage.getItem('ils.state.v1')).leitner);
const boxes = Object.values(st).map(c => c.box).sort().join('');
ok(Object.keys(st).length === 10 && boxes === '1111111112', 'Leitner moves one card up and keeps a missed card in box 1');
// languages: walk every section and report untranslated chrome
const PERSIAN = /[؀-ۿ]/;
for (const [i, lang] of [[1, 'en'], [2, 'it']]) {
  await tab(4); await page.locator('.main .row', { hasText: /تنظیمات|Settings|Impostazioni/ }).first().click();
  await page.locator('.chip', { hasText: lang === 'en' ? 'English' : 'Italiano' }).click(); await page.waitForTimeout(40);
  ok((await page.evaluate(() => document.documentElement.dir)) === 'ltr', lang + ' switches layout to LTR');
  const miss = new Set();
  const scan = async () => { for (const t of await page.locator('h1, h2, h3, .tab, .btn, .chip, .stat span, .row .title, label').allInnerTexts()) if (PERSIAN.test(t) && !t.includes('فارسی\u200e')) miss.add(t.trim()); };
  await tab(0); await scan();
  await tab(4); await scan();
  const n = await page.locator('.main .row').count();
  for (let k = 0; k < n; k++) {
    await tab(4); await page.locator('.main .row').nth(k).click(); await page.waitForTimeout(25); await scan();
    const rows = await page.locator('.main .row:not([disabled])').count();
    if (rows) { await page.locator('.main .row:not([disabled])').first().click(); await page.waitForTimeout(25); await scan(); }
    const o = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth); if (o) miss.add('overflow');
  }
  ok(miss.size === 0, `${lang}: no Persian left in interface chrome` + (miss.size ? ': ' + [...miss].slice(0, 25).join(' | ') : ''));
}
// dictionary with mocks: success, quota, offline, bad Google key
await tab(4); await page.locator('.main .row', { hasText: 'Impostazioni' }).first().click(); await page.locator('.chip', { hasText: 'فارسی' }).click(); await page.waitForTimeout(30);
await page.locator('#google-key').fill('FAKE'); await page.getByRole('button', { name: 'ذخیرهٔ کلید' }).click();
await page.route('**/translation.googleapis.com/**', r => r.fulfill({ status: r.request().method() === 'OPTIONS' ? 204 : 403, contentType: 'application/json', body: '{}', headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type', 'access-control-allow-methods': 'POST' } }));
await openMore(11);
await page.locator('#dict-q').fill('casa'); await page.getByRole('button', { name: 'جست‌وجو و ترجمه' }).click();
await page.waitForSelector('.result', { timeout: 15000 });
await page.waitForTimeout(2500);
const body = await page.locator('.main').innerText();
ok(/خانه/.test(body), 'built-in vocabulary match shown');
ok(/Noun/.test(body) && /house/.test(body), 'LIVE Wiktionary definition reached from WebKit');
const liveFa = await page.locator('.result').first().innerText(); ok(PERSIAN.test(liveFa), 'LIVE MyMemory Italian > Persian: ' + liveFa);
ok(/Google درخواست را نپذیرفت/.test(body), 'Google refusal reported, other results kept');
await page.locator('.chip', { hasText: 'انگلیسی' }).click(); await page.waitForTimeout(2500);
const liveEn = await page.locator('.result').first().innerText(); ok(/^[\x00-\x7f]+$/.test(liveEn), 'LIVE MyMemory Italian > English: ' + liveEn);
ok((await page.locator('a[href*="translate.google.com"]').getAttribute('href')).includes('sl=it&tl=en'), 'Google Translate link carries text and direction');
await page.locator('#dict-q').fill('zzqxy'); await page.getByRole('button', { name: 'جست‌وجو و ترجمه' }).click(); await page.waitForTimeout(2500);
ok((await page.getByText('در ویکی‌واژه مدخلی برای این واژه نیست').count()) === 1, 'unknown word has an empty state');
// saving a word that is not in the course to My words
await page.locator('#dict-q').fill('farfalla'); await page.getByRole('button', { name: 'جست‌وجو و ترجمه' }).click();
await page.waitForSelector('.result', { timeout: 15000 }); await page.waitForTimeout(2500);
const pre = await page.locator('#my-en').inputValue(); ok(/butterfl/i.test(pre), 'English meaning pre-filled from live translation: ' + pre);
await page.getByRole('button', { name: 'ذخیره و افزودن به لایتنر' }).click(); await page.waitForSelector('text=ذخیره شد', { timeout: 15000 });
const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ils.state.v1')));
ok(saved.mine.farfalla?.en && PERSIAN.test(saved.mine.farfalla?.fa ?? ''), 'saved word has English and Persian meanings: ' + JSON.stringify(saved.mine.farfalla));
ok(!!saved.leitner['m:farfalla'] && !!saved.srs['m:farfalla'], 'saved word joins Leitner and Smart Revision');
await tab(4); await page.locator('.main .row', { hasText: 'آزمایشگاه واژگان' }).first().click(); await page.waitForTimeout(40);
ok((await page.locator('.myrow', { hasText: 'farfalla' }).count()) === 1, 'saved word listed under My words');
await page.locator('#vocab-search').fill('gatto'); ok((await page.getByRole('button', { name: /جست‌وجو در فرهنگ آنلاین/ }).count()) === 1, 'vocabulary search offers the online dictionary');
await page.locator('#vocab-search').fill('');
await openMore(10); let seen = false;
for (let k = 0; k < 15 && !seen; k++) { if (!(await page.locator('.flash').count())) break; seen = /farfalla/.test(await page.locator('.flash').innerText()); if (!seen) { await page.locator('.flash').click(); await page.getByRole('button', { name: 'بلد بودم' }).click(); } }
ok(seen, 'saved word appears as a Leitner card');
await tab(4); await page.locator('.main .row', { hasText: 'آزمایشگاه واژگان' }).first().click();
await page.getByRole('button', { name: 'حذف farfalla' }).click(); await page.waitForTimeout(40);
const gone = await page.evaluate(() => JSON.parse(localStorage.getItem('ils.state.v1')));
ok(!gone.mine.farfalla && !gone.leitner['m:farfalla'], 'deleting a saved word removes its cards');
await openMore(11);
await ctx.setOffline(true);
await page.locator('#dict-q').fill('pane'); await page.getByRole('button', { name: 'جست‌وجو و ترجمه' }).click(); await page.waitForTimeout(800);
ok((await page.getByText('اتصال ناموفق بود').count()) >= 1, 'offline reports a connection error');
await ctx.setOffline(false);
const s = await page.evaluate(() => localStorage.getItem('ils.state.v1'));
ok(!s.includes('FAKE'), 'Google key is not in saved state or backups');
await browser.close(); console.log(fails.length ? `\n${fails.length} FAILED` : '\nALL PASSED'); process.exit(fails.length ? 1 : 0);
