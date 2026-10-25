#!/usr/bin/env node
/* 生成分享图 og.png (1200×630) 与 apple-touch-icon.png (180×180)。
   用法: node tools/make-images.cjs
   依赖 playwright (Chromium)。若全局没装，可用环境变量指向任意已安装的 playwright 包：
     PLAYWRIGHT_MODULE=/path/to/node_modules/playwright node tools/make-images.cjs */
const path = require('path');
const fs = require('fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(__dirname, 'og-template.html'), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(root, 'og.png'), type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log('og.png written');
  const icon = await browser.newPage({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 1 });
  const svg = fs.readFileSync(path.join(root, 'favicon.svg'), 'utf8').replace(/width="64" height="64"/, 'width="180" height="180"');
  await icon.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
  await icon.screenshot({ path: path.join(root, 'apple-touch-icon.png'), type: 'png', omitBackground: true, clip: { x: 0, y: 0, width: 180, height: 180 } });
  console.log('apple-touch-icon.png written');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
