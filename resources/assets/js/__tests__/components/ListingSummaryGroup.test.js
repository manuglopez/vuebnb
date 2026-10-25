import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import ListingSummaryGroup from '../../components/ListingSummaryGroup.vue';

const listings = [
    { id: 1, title: 'A', address: 'Taiwan', price_per_night: '$10', thumb: 't1.jpg' },
    { id: 2, title: 'B', address: 'Taiwan', price_per_night: '$20', thumb: 't2.jpg' },
];

describe('ListingSummaryGroup', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('muestra el país en el encabezado (AC rejilla por país)', () => {
        const wrapper = mount(ListingSummaryGroup, {
            props: { country: 'Taiwan', listings },
            global: {
                stubs: { 'router-link': { template: '<a><slot /></a>' } },
            },
        });
        expect(wrapper.find('h1').text()).toBe('Places in Taiwan');
    });

    it('renderiza un ListingSummary por cada listing', () => {
        const wrapper = mount(ListingSummaryGroup, {
            props: { country: 'Taiwan', listings },
            global: {
                stubs: { 'router-link': { template: '<a><slot /></a>' } },
            },
        });
        const summaries = wrapper.findAllComponents({ name: 'ListingSummary' });
        expect(summaries).toHaveLength(2);
        expect(summaries[0].props('listing')).toEqual(listings[0]);
        expect(summaries[1].props('listing')).toEqual(listings[1]);
    });
});
