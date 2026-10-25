import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import SavedPage from '../../components/SavedPage.vue';
import { useListingStore } from '../../store';

describe('SavedPage', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('muestra solo los listings guardados (AC favoritos)', () => {
        const store = useListingStore();
        store.listing_summaries = [
            { id: 1, title: 'Guardado', address: 'Taiwan', price_per_night: '$10', thumb: 't1.jpg' },
            { id: 2, title: 'No guardado', address: 'Cuba', price_per_night: '$20', thumb: 't2.jpg' },
        ];
        store.saved = [1];
        const wrapper = mount(SavedPage, {
            global: {
                stubs: { 'router-link': { template: '<a><slot /></a>' } },
            },
        });
        const summaries = wrapper.findAllComponents({ name: 'ListingSummary' });
        expect(summaries).toHaveLength(1);
        expect(summaries[0].props('listing').id).toBe(1);
    });

    it('muestra el mensaje de vacío cuando no hay listings guardados', () => {
        const store = useListingStore();
        store.listing_summaries = [
            { id: 1, title: 'A', address: 'Taiwan', price_per_night: '$10', thumb: 't1.jpg' },
        ];
        store.saved = [];
        const wrapper = mount(SavedPage, {
            global: {
                stubs: { 'router-link': { template: '<a><slot /></a>' } },
            },
        });
        expect(wrapper.text()).toContain('No saved listings.');
        expect(wrapper.findAllComponents({ name: 'ListingSummary' })).toHaveLength(0);
    });

    it('muestra el encabezado "Saved listings"', () => {
        const wrapper = mount(SavedPage, {
            global: {
                stubs: { 'router-link': { template: '<a><slot /></a>' } },
            },
        });
        expect(wrapper.find('h2').text()).toBe('Saved listings');
    });
});
