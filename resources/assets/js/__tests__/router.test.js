import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useListingStore } from '../store';

// Mock de axios: nunca toca la red real (AC-F3).
vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
    },
}));

import axios from 'axios';
import router from '../router';

describe('router guard', () => {
    let store;

    beforeEach(async () => {
        setActivePinia(createPinia());
        store = useListingStore();
        vi.clearAllMocks();
        delete window.server_data;
        // El router es un singleton: navegamos a /saved para resetear la ruta
        // y que cada test dispare el guard de nuevo (evita navegación duplicada).
        axios.get.mockResolvedValue({ data: { listings: [] } });
        await router.push('/saved');
        await router.isReady();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        delete window.server_data;
    });

    it('carga los listings de la API al navegar a la home sin datos (AC navegación)', async () => {
        axios.get.mockResolvedValue({ data: { listings: [{ id: 1, address: 'Taiwan' }] } });
        await router.push('/');
        expect(axios.get).toHaveBeenCalledWith('/api/');
        expect(store.listing_summaries).toEqual([{ id: 1, address: 'Taiwan' }]);
    });

    it('no llama a la API si ya hay listing_summaries (AC navegación)', async () => {
        store.listing_summaries = [{ id: 1, address: 'Taiwan' }];
        await router.push('/');
        expect(axios.get).not.toHaveBeenCalled();
    });

    it('carga un listing concreto desde la API en la ruta de detalle', async () => {
        axios.get.mockResolvedValue({ data: { listing: { id: 3, title: 'Casa' } } });
        await router.push('/listing/3');
        expect(axios.get).toHaveBeenCalledWith('/api/listing/3');
        expect(store.listings).toContainEqual({ id: 3, title: 'Casa' });
    });

    it('no llama a la API si el listing ya está en el store', async () => {
        store.listings = [{ id: 3, title: 'Casa' }];
        await router.push('/listing/3');
        expect(axios.get).not.toHaveBeenCalled();
    });

    it('usa server_data cuando la ruta coincide con server_data.path', async () => {
        window.server_data = JSON.stringify({
            path: '/listing/3',
            listing: { id: 3, title: 'Desde server_data' },
        });
        await router.push('/listing/3');
        expect(axios.get).not.toHaveBeenCalled();
        expect(store.listings).toContainEqual({ id: 3, title: 'Desde server_data' });
    });

    it('usa server_data en una ruta no-listing cuando el path coincide', async () => {
        // Precargamos un listing para que el push a /listing/3 no llame a axios.
        store.listings = [{ id: 3, title: 'Casa' }];
        window.server_data = JSON.stringify({
            path: '/saved',
            listings: [{ id: 1, address: 'Taiwan' }],
        });
        // Salimos de /saved (ruta de reset) vía /listing/3 sin llamar a la API.
        await router.push('/listing/3');
        await router.push('/saved');
        expect(axios.get).not.toHaveBeenCalled();
        expect(store.listing_summaries).toEqual([{ id: 1, address: 'Taiwan' }]);
    });

    it('continúa la navegación aunque la API falle (catch del guard)', async () => {
        const err = new Error('network');
        axios.get.mockRejectedValue(err);
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        await router.push('/');
        expect(consoleSpy).toHaveBeenCalledWith('Router guard error:', err);
        expect(router.currentRoute.value.name).toBe('home');
        consoleSpy.mockRestore();
    });

    it('scrollBehavior devuelve {top: 0} si no hay savedPosition', () => {
        const res = router.options.scrollBehavior({}, {}, null);
        expect(res).toEqual({ top: 0 });
    });

    it('scrollBehavior devuelve savedPosition cuando existe', () => {
        const saved = { top: 150, left: 0 };
        const res = router.options.scrollBehavior({}, {}, saved);
        expect(res).toBe(saved);
    });

    it('define las rutas esperadas (home, saved, listing)', () => {
        expect(router.resolve('/').name).toBe('home');
        expect(router.resolve('/saved').name).toBe('saved');
        expect(router.resolve('/listing/123').name).toBe('listing');
        const homeRoute = router.options.routes.find(r => r.name === 'home');
        expect(homeRoute.path).toBe('/');
    });

    it('llama a la API si server_data existe pero para una ruta diferente', async () => {
        window.server_data = JSON.stringify({
            path: '/other-path',
            listing: { id: 99 },
        });
        axios.get.mockResolvedValue({ data: { listings: [{ id: 1, address: 'Taiwan' }] } });
        await router.push('/');
        expect(axios.get).toHaveBeenCalledWith('/api/');
        expect(store.listing_summaries).toEqual([{ id: 1, address: 'Taiwan' }]);
    });
});
