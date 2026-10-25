import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useListingStore } from '../store';

const mockListings = [
    { id: 1, title: 'Listing 1', address: 'Address 1' },
    { id: 3, title: 'Listing 3', address: 'Address 3' },
    { id: 15, title: 'Listing 15', address: 'Address 15' },
];

describe('ListingStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('inicializa con el estado por defecto', () => {
        const store = useListingStore();
        expect(store.$id).toBe('listing');
        expect(store.saved).toEqual([1, 15]);
        expect(store.listing_summaries).toEqual([]);
        expect(store.listings).toEqual([]);
    });

    it('toggleSaved añade y quita ids', () => {
        const store = useListingStore();
        expect(store.saved).toContain(1);
        expect(store.saved).toContain(15);

        store.toggleSaved(2);
        expect(store.saved).toContain(2);
        expect(store.saved).toHaveLength(3);

        // Ya guardado: lo quita.
        store.toggleSaved(1);
        expect(store.saved).not.toContain(1);
        expect(store.saved).toHaveLength(2);
        expect(store.saved).toEqual([15, 2]);
    });

    it('addData con ruta saved reemplaza listing_summaries', () => {
        const store = useListingStore();
        store.addData({ route: 'saved', data: { listings: mockListings } });
        expect(store.listing_summaries).toEqual(mockListings);
    });

    it('addData con ruta listing añade a listings', () => {
        const store = useListingStore();
        const mockListing = { id: 1, title: 'Test Listing', address: 'Test Address' };
        store.addData({ route: 'listing', data: { listing: mockListing } });
        expect(store.listings).toContainEqual(mockListing);
        expect(store.listing_summaries).toEqual([]);
    });

    describe('getListing', () => {
        it('encuentra por id numérico', () => {
            const store = useListingStore();
            store.listings = mockListings;
            expect(store.getListing(3)).toEqual(mockListings[1]);
            expect(store.getListing(2)).toBeUndefined();
        });

        it('encuentra por id string (el id de la URL llega como string)', () => {
            const store = useListingStore();
            store.listings = mockListings;
            // La URL /listing/3 pasa route.params.listing = '3' (string).
            expect(store.getListing('3')).toEqual(mockListings[1]);
            expect(store.getListing('15')).toEqual(mockListings[2]);
            expect(store.getListing('2')).toBeUndefined();
        });
    });
});