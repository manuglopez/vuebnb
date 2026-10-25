import { describe, it, expect, vi, beforeEach } from 'vitest';

// main.js monta la app al importarse: mockeamos createApp para capturar el objeto app
// y verificar que se registran Pinia y el router y se monta en #app (AC bootstrap).
const appMock = {
    use: vi.fn().mockReturnThis(),
    mount: vi.fn().mockReturnThis(),
};

vi.mock('vue', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        createApp: vi.fn(() => appMock),
    };
});

vi.mock('../router', () => ({
    default: { name: 'router-mock' },
}));

import { createApp } from 'vue';
import router from '../router';

describe('main.js bootstrap', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('crea la app, registra Pinia y el router y monta en #app', async () => {
        // Importar main.js dispara el bootstrap.
        await import('../main.js');

        expect(createApp).toHaveBeenCalledTimes(1);
        expect(appMock.use).toHaveBeenCalledTimes(2);
        expect(appMock.mount).toHaveBeenCalledWith('#app');
        // El router mockeado se registra vía app.use.
        expect(appMock.use).toHaveBeenCalledWith(router);
    });
});
