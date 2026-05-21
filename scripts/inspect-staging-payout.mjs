import { chromium } from 'playwright';

const url = 'https://staging.riocity9.com/en';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForSelector('.payout-container', { timeout: 60000 });
    await page.evaluate(() => {
        document.querySelectorAll('.sweet-alert, .modal, [class*="modal"]').forEach((el) => {
            el.remove();
        });
    });
    await page.waitForTimeout(1500);

    const data = await page.evaluate(() => {
        const pick = (el) => {
            if (!el) return null;
            const s = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return {
                className: el.className,
                width: Math.round(r.width),
                height: Math.round(r.height),
                padding: s.padding,
                background: s.backgroundColor,
                border: s.border,
                borderRadius: s.borderRadius,
                fontSize: s.fontSize,
                fontWeight: s.fontWeight,
                color: s.color,
                boxShadow: s.boxShadow,
            };
        };

        const container = document.querySelector('.payout-container');
        const header = container?.querySelector('.t3-custom-title, .t3-custom-second-title, h2, h3');
        const items = [...document.querySelectorAll('.payout-list .item')].slice(0, 2);

        return {
            container: pick(container),
            headerHtml: header?.innerHTML?.slice(0, 200),
            header: pick(header),
            items: items.map((item) => ({
                item: pick(item),
                imageWrap: pick(item.querySelector('.payout-list-image')),
                img: pick(item.querySelector('.payout-list-image img')),
                title: pick(item.querySelector('.title')),
                user: pick(item.querySelector('.username')),
                amount: pick(item.querySelector('.amount')),
                titleText: item.querySelector('.title')?.textContent?.trim(),
                userText: item.querySelector('.username')?.textContent?.trim(),
                amountText: item.querySelector('.amount')?.textContent?.trim(),
            })),
            itemCount: document.querySelectorAll('.payout-list .item').length,
        };
    });

    console.log(JSON.stringify(data, null, 2));
} catch (err) {
    console.error('ERR', err.message);
    process.exitCode = 1;
} finally {
    await browser.close();
}
