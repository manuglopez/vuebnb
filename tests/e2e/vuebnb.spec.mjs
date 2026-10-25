// E2E del front de vuebnb (Playwright @playwright/test).
// Basado en los scripts de referencia e2e-ref/{layout,click,photos}.mjs (DISENO.md §7).
// Criterios:
//   1. 1920/1280/768/390 px: sin scroll horizontal, .listing-grid con 5/4/2/1 columnas,
//      y sin errores de consola, pageerror ni respuestas 4xx.
//   2. Clic en una tarjeta -> ficha con cabecera, amenities y precios -> «Back to list» vuelve
//      a / conservando el scroll.
//   3. /listing/1 abierta directamente -> «Back to list» lleva a /.
//   4. «View Photos» -> #modal visible, la flecha cambia el src de la imagen y Esc lo cierra.
import { test, expect } from '@playwright/test';

function watchErrors(page, tag, buckets) {
    page.on('console', m => {
        if (m.type() === 'error') buckets.console.push(`${tag} console: ${m.text()}`);
    });
    page.on('pageerror', e => buckets.pageerror.push(`${tag} pageerror: ${e.message}`));
    page.on('response', r => {
        if (r.status() >= 400) buckets.http.push(`${tag} ${r.status()} ${r.url()}`);
    });
}

function assertClean(buckets, tag) {
    expect(buckets.console.filter(e => e.startsWith(tag)), `console errors en ${tag}`).toEqual([]);
    expect(buckets.pageerror.filter(e => e.startsWith(tag)), `pageerror en ${tag}`).toEqual([]);
    expect(buckets.http.filter(e => e.startsWith(tag)), `respuestas 4xx+ en ${tag}`).toEqual([]);
}

test.describe('Rejilla adaptable y overflow (AC-E2E-layout)', () => {
    const sizes = [
        { width: 1920, height: 1080, columns: 5 },
        { width: 1280, height: 900, columns: 4 },
        { width: 768, height: 1024, columns: 2 },
        { width: 390, height: 844, columns: 1 },
    ];

    for (const { width, height, columns } of sizes) {
        test(`${width}px: ${columns} columnas, sin scroll horizontal ni errores`, async ({ page }) => {
            const buckets = { console: [], pageerror: [], http: [] };
            watchErrors(page, `w${width}`, buckets);
            await page.setViewportSize({ width, height });
            await page.goto('/', { waitUntil: 'networkidle' });
            await expect(page.locator('.listing-grid').first()).toBeVisible();

            const metrics = await page.evaluate(() => {
                const grid = document.querySelector('.listing-grid');
                return {
                    overflow: document.documentElement.scrollWidth - window.innerWidth,
                    columns: grid
                        ? getComputedStyle(grid).gridTemplateColumns.split(' ').length
                        : 0,
                };
            });
            expect(metrics.overflow, `overflow horizontal a ${width}px`).toBe(0);
            expect(metrics.columns, `columnas a ${width}px`).toBe(columns);
            assertClean(buckets, `w${width}`);
        });
    }
});

test.describe('Navegación portada -> ficha -> atrás (AC-E2E-click)', () => {
    test('clic en tarjeta: cabecera, amenities y precios; Back to list conserva el scroll', async ({ page }) => {
        const buckets = { console: [], pageerror: [], http: [] };
        watchErrors(page, 'nav', buckets);
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto('/', { waitUntil: 'networkidle' });

        // Deja la página haciendo scroll para comprobar que se recupera al volver.
        await page.mouse.wheel(0, 900);
        await page.waitForTimeout(400);
        await page.locator('.listing-summary a').nth(9).click();
        await page.waitForURL(/\/listing\/\d+$/);

        // La ficha: cabecera, al menos una amenity (con icono .fa) y al menos un precio.
        await expect(page.locator('.header')).toBeVisible();
        const amenityItems = page.locator('.lists .list').nth(0).locator('.list-item');
        const priceItems = page.locator('.lists .list').nth(1).locator('.list-item');
        await expect(amenityItems.first()).toBeVisible();
        await expect(amenityItems.locator('i.fa').first()).toBeVisible();
        await expect(priceItems.first()).toBeVisible();
        await expect(priceItems.first()).toContainText('Per night');

        // «Back to list» vuelve a / conservando la posición de scroll.
        await page.locator('.back-link').click();
        await page.waitForURL(u => u.pathname === '/');
        expect(new URL(page.url()).pathname).toBe('/');
        const scrollY = await page.evaluate(() => window.scrollY);
        expect(scrollY, 'scrollY tras volver').toBeGreaterThan(0);
        assertClean(buckets, 'nav');
    });

    test('entrada directa a /listing/1: Back to list lleva a /', async ({ page }) => {
        const buckets = { console: [], pageerror: [], http: [] };
        watchErrors(page, 'direct', buckets);
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto('/listing/1', { waitUntil: 'networkidle' });
        await expect(page.locator('.header')).toBeVisible();
        await page.locator('.back-link').click();
        await page.waitForURL(u => u.pathname === '/');
        expect(new URL(page.url()).pathname).toBe('/');
        assertClean(buckets, 'direct');
    });
});

test.describe('View Photos (AC-E2E-photos)', () => {
    for (const how of ['directa', 'desde-portada']) {
        test(`abre el modal (${how}), la flecha cambia el src y Esc lo cierra`, async ({ page }) => {
            const buckets = { console: [], pageerror: [], http: [] };
            watchErrors(page, how, buckets);
            await page.setViewportSize({ width: 1280, height: 900 });

            if (how === 'directa') {
                await page.goto('/listing/1', { waitUntil: 'networkidle' });
            } else {
                await page.goto('/', { waitUntil: 'networkidle' });
                await page.locator('.listing-summary a').nth(4).click();
                await page.waitForURL(/\/listing\/\d+$/);
            }

            await expect(page.locator('#modal')).toBeHidden();
            await page.locator('button.view-photos').click();
            await expect(page.locator('#modal')).toBeVisible();

            const srcBefore = await page.locator('#modal img').getAttribute('src');
            expect(srcBefore).toBeTruthy();

            // Flecha derecha: cambia el src de la imagen.
            await page.locator('#modal .carousel-control').last().click();
            await expect
                .poll(async () => page.locator('#modal img').getAttribute('src'), {
                    timeout: 5_000,
                })
                .not.toBe(srcBefore);
            const srcAfter = await page.locator('#modal img').getAttribute('src');
            expect(srcAfter).not.toBe(srcBefore);

            // Esc cierra el modal.
            await page.keyboard.press('Escape');
            await expect(page.locator('#modal')).toBeHidden();
            assertClean(buckets, how);
        });
    }
});