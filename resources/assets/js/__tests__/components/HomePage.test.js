import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import HomePage from '../../components/HomePage.vue';
import { useListingStore } from '../../store';

describe('HomePage', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('agrupa los listings por país y renderiza un grupo por país (AC rejilla)', () => {
        const store = useListingStore();
        store.listing_summaries = [
            { id: 1, address: 'Taiwan, Taipei' },
            { id: 2, address: 'Taiwan, Taichung' },
            { id: 3, address: 'Cuba, Havana' },
        ];
        const wrapper = mount(HomePage, {
            global: {
                stubs: { 'router-link': { template: '<a><slot /></a>' } },
            },
        });
        const groups = wrapper.findAllComponents({ name: 'ListingSummaryGroup' });
        expect(groups).toHaveLength(2);
        expect(groups[0].props('country')).toBe('Taiwan');
        expect(groups[0].props('listings')).toHaveLength(2);
        expect(groups[1].props('country')).toBe('Cuba');
        expect(groups[1].props('listings')).toHaveLength(1);
    });

    it('no renderiza grupos cuando no hay listings', () => {
        const wrapper = mount(HomePage, {
            global: {
                stubs: { 'router-link': { template: '<a><slot /></a>' } },
            },
        });
        expect(wrapper.findAllComponents({ name: 'ListingSummaryGroup' })).toHaveLength(0);
    });
});
