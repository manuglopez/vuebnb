import { defineConfig } from '@playwright/test';

// Puerto para el E2E (por defecto 8771; se puede cambiar para demos RED/GREEN).
const PORT = Number(process.env.VUEBNB_E2E_PORT || 8771);
const BASE = `http://127.0.0.1:${PORT}`;

// Chromium ya cacheado en la máquina (misma revisión que usan los scripts e2e-ref).
const CHROMIUM =
    process.env.VUEBNB_E2E_CHROMIUM ||
    '/home/mglopez/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome';

export default defineConfig({
    testDir: './tests/e2e',
    timeout: 30_000,
    expect: { timeout: 10_000 },
    fullyParallel: false,
    workers: 1,
    reporter: [['list']],
    use: {
        baseURL: BASE,
        launchOptions: {
            executablePath: CHROMIUM,
        },
        viewport: { width: 1280, height: 900 },
        trace: 'retain-on-failure',
    },
    webServer: {
        command: `bash tests/e2e/serve.sh ${PORT}`,
        url: BASE,
        reuseExistingServer: true,
        timeout: 120_000,
    },
});