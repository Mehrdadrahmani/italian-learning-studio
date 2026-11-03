// Real WebKit at iPhone size. Speech and microphone are stubbed because headless WebKit has neither.
import { webkit, devices } from 'playwright';
import { spawn } from 'node:child_process';
const shots = process.env.SHOTS;
const srv = spawn('node', ['scripts/serve.mjs'], { env: { ...process.env, PORT: '4199' } });
process.on('exit', () => srv.kill());
process.on('uncaughtException', e => { console.error(e); process.exit(1); });
await new Promise(r => srv.stdout.once('data', r));
const browser = await webkit.launch();
const ctx = await browser.newContext({ ...devices['iPhone 13'], locale: 'fa-IR' });
await ctx.addInitScript(() => {
  window.__spoken = [];
  const v = [{ name: 'Alice', lang: 'it-IT', voiceURI: 'alice' }];
  class U { constructor(t) { this.text = t; } }
  window.SpeechSynthesisUtterance = U;
  Object.defineProperty(window, 'speechSynthesis', { value: { getVoices: () => v, cancel() {}, addEventListener() {}, removeEventListener() {}, speak(u) { window.__spoken.push({ t: u.text, r: u.rate, l: u.lang }); setTimeout(() => u.onend?.(), 5); } } });
  class MR { static isTypeSupported(m) { return m === 'audio/mp4'; } constructor(s, o) { this.mimeType = o?.mimeType; } start() {} stop() { this.ondataavailable?.({ data: new Blob(['x'], { type: 'audio/mp4' }) }); this.onstop?.(); } }
  window.MediaRecorder = MR;
  Object.defineProperty(navigator, 'mediaDevices', { value: { getUserMedia: async () => ({ getTracks: () => [{ stop() {} }] }) } });
});
const page = await ctx.newPage();
const fails = [], pass = m => console.log('  ok  ' + m), fail = m => { fails.push(m); console.log('FAIL  ' + m); };
page.on('pageerror', e => fail('pageerror: ' + e.message));
page.on('console', m => { if (m.type() === 'error' && !/fonts\.g|Failed to load resource|access control|Button failed to load/.test(m.text())) fail('console: ' + m.text()); });
await page.goto('http://localhost:4199/');
const click = t => page.getByRole('button', { name: t, exact: false }).first().click();
const tab = async t => { await page.locator('.tab', { hasText: t }).click(); };
const backBtn = () => page.locator('button[aria-label="بازگشت"]').click();
const crashed = () => page.getByText('این صفحه باز نشد').count();
const audit = async name => {
  const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: innerWidth, wide: [...document.querySelectorAll('.main *')].filter(e => !e.closest('.tbl') && e.getBoundingClientRect().right > innerWidth + 1).length }));
  if (o.sw > o.w || o.wide) fail(`overflow ${name}: ${JSON.stringify(o)}`);
  if (await crashed()) fail('crash ' + name);
  if (!(await page.locator('.main').innerText()).trim()) fail('empty ' + name);
};
const shot = async n => { if (shots) await page.screenshot({ path: `${shots}/${n}.png` }); };
const answerAll = async () => {
  for (let i = 0; i < 40; i++) {
    const c = page.locator('.card:has(.opts), .card:has(input.field), .card:has(.slot)').last();
    if (!(await c.count())) return;
    if (await c.locator('.opt:not([disabled])').count()) await c.locator('.opt').first().click();
    else if (await c.locator('input.field:not([disabled])').count()) { await c.locator('input.field').fill('test'); await c.getByRole('button', { name: 'بررسی' }).click(); }
    else if (await c.locator('.slot').count()) { while (await c.locator('.chips .chip').count()) await c.locator('.chips .chip').first().click(); await c.getByRole('button', { name: 'بررسی' }).click(); }
    const n = c.getByRole('button', { name: /پرسش بعدی|پایان|تکمیل درس/ });
    const last = !(await c.getByRole('button', { name: 'پرسش بعدی' }).count());
    await n.click(); if (last) return;
  }
};
await shot('01-home'); await audit('home');
// RTL / LTR
const dir = await page.evaluate(() => ({ root: getComputedStyle(document.getElementById('root')).direction, it: getComputedStyle(document.querySelector('.hero .name')).direction }));
dir.root === 'rtl' && dir.it === 'ltr' ? pass('RTL shell, LTR Italian') : fail('direction ' + JSON.stringify(dir));
// All 13 sections
await tab('بیشتر');
const names = await page.locator('.main .row .title').allInnerTexts();
names.length === 16 ? pass('16 entries in More') : fail('more ' + names.length);
for (const n of names) { await page.locator('.main .row', { hasText: n }).first().click(); await page.waitForTimeout(40); await audit(n); await shot('s-' + names.indexOf(n)); await tab('بیشتر'); }
pass('all sections open');
// Drill every list row: lessons, pronunciation, grammar, text, listening, speaking, reading, writing
const drill = async (section, selector = '.main .row:not([disabled])') => {
  await tab('بیشتر'); await page.locator('.main .row', { hasText: section }).first().click();
  const n = await page.locator(selector).count();
  for (let i = 0; i < n; i++) { await page.locator(selector).nth(i).click(); await page.waitForTimeout(25); await audit(`${section} #${i}`); await backBtn(); }
  pass(`${section}: ${n} detail screens`); return n;
};
for (const s of ['آکادمی تلفظ', 'آکادمی دستور', 'استودیوی جمله و متن', 'آزمایشگاه شنیداری', 'تمرین گفتار', 'خواندن و نوشتن']) await drill(s);
await tab('بیشتر'); await page.locator('.main .row', { hasText: 'مسیر A1' }).first().click();
for (let i = 0; i < 5; i++) { await page.locator('.main .row').nth(i).click(); const n = await page.locator('.main .row:not([disabled])').count(); for (let j = 0; j < n; j++) { await page.locator('.main .row:not([disabled])').nth(j).click(); await page.waitForTimeout(25); await audit(`lesson ${i}/${j}`); await backBtn(); } await backBtn(); }
pass('every lesson opens');
// Vocabulary: all 1 word sample, search, flashcards
await tab('واژگان'); await audit('vocab');
await page.locator('#vocab-search').fill('casa');
(await page.locator('.main .row').count()) >= 1 ? pass('vocab search') : fail('vocab search');
await page.locator('#vocab-search').fill('zzzz'); (await page.getByText('واژه‌ای پیدا نشد').count()) ? pass('vocab empty state') : fail('empty state');
await page.locator('#vocab-search').fill('');
await click('فلش‌کارت با');
await page.locator('.flash').click(); await shot('flash'); await click('بلدم');
await page.locator('.flash').click(); await click('نیاز به تمرین');
pass('flashcards');
// Complete the first lesson
await tab('خانه');
const before = await page.locator('.stat b').nth(2).innerText();
await page.getByRole('button', { name: /شروع نخستین درس|ادامهٔ یادگیری/ }).click();
await audit('lesson'); await shot('lesson');
await answerAll();
(await page.getByText('درس کامل شد').count()) ? pass('lesson completes') : fail('lesson did not complete');
await click('بازگشت'); await shot('home-after');
const st = await page.evaluate(() => JSON.parse(localStorage.getItem('ils.state.v1')));
Object.keys(st.lessons).length === 1 ? pass('lesson recorded') : fail('lesson record');
// Revision
await tab('مرور');
const cards = Object.keys(st.srs).length;
for (let i = 0; await page.locator('.flash').count(); i++) { await page.locator('.flash').click(); if (!i) await shot('review'); await page.locator('.grades .btn').nth(2).click(); await page.waitForTimeout(30); }
const s2 = await page.evaluate(() => JSON.parse(localStorage.getItem('ils.state.v1')));
const graded = Object.values(s2.srs).filter(c => c.grade); 
graded.some(c => c.interval >= 1 && c.due > Date.now()) ? pass(`revision scheduled (${cards} cards, ${graded.length} graded)`) : fail('revision');
// Audio
await tab('تلفظ'); await page.locator('.main .row').nth(1).click();
await click('آهسته'); await page.waitForTimeout(30);
const sp = await page.evaluate(() => window.__spoken.at(-1));
sp?.l === 'it-IT' && sp.r === 0.6 ? pass('slow playback uses Italian voice at 0.6') : fail('speech ' + JSON.stringify(sp));
await page.getByRole('button', { name: 'شروع ضبط' }).click(); await page.getByRole('button', { name: 'پایان ضبط' }).click();
(await page.locator('audio').count()) ? pass('record → playback UI') : fail('recorder');
await page.getByRole('button', { name: 'شبیه مرجع بود' }).click();
// Tests at each level, every kind
await tab('بیشتر'); await page.locator('.main .row', { hasText: 'آزمون‌ها' }).first().click();
for (const l of ['A1', 'A2', 'B1', 'B2', 'C1']) {
  await page.locator('.chip', { hasText: l }).click();
  for (let k = 0; k < 8; k++) { await page.locator('.main .list').first().locator('.row').nth(k).click(); await audit(`test ${l} ${k}`); await backBtn(); await page.locator('.chip', { hasText: l }).click(); }
}
await page.locator('.chip', { hasText: 'A1' }).click(); await page.locator('.main .list').first().locator('.row').first().click();
await answerAll(); await audit('test result');
(await page.getByText(/نتیجه:/).count()) ? pass('test scored with explanations') : fail('test result');
await shot('result');
// Tutor stays honest without Claude
await tab('بیشتر'); await page.locator('.main .row', { hasText: 'مربی' }).first().click();
(await page.getByText('نسخهٔ نصب‌شده در دسترس نیست').count()) ? pass('tutor reports unavailable') : fail('tutor');
// Settings
await tab('بیشتر'); await page.locator('.main .row', { hasText: 'تنظیمات' }).first().click();
await page.locator('.chip', { hasText: 'تیره' }).click(); await page.waitForTimeout(40);
(await page.evaluate(() => document.documentElement.dataset.theme)) === 'dark' ? pass('dark theme') : fail('theme'); await audit('dark'); await shot('dark');
await tab('خانه'); await shot('home-dark');
await tab('بیشتر'); await page.locator('.main .row', { hasText: 'تنظیمات' }).first().click(); await page.locator('.chip', { hasText: 'روشن' }).click();
// Persistence
await page.reload(); await page.waitForTimeout(100);
const s3 = await page.evaluate(() => JSON.parse(localStorage.getItem('ils.state.v1')));
Object.keys(s3.lessons).length === 1 && s3.tests.length > 0 && Object.values(s3.pron).some(p => p.self === 'good') ? pass('progress survives reload') : fail('persistence');
(await page.locator('.stat b').nth(0).innerText()) === '۱' ? pass('streak shows 1') : fail('streak');
await browser.close(); srv.kill();
console.log(fails.length ? `\n${fails.length} FAILED` : '\nALL PASSED'); process.exit(fails.length ? 1 : 0);
