import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FeatureList from '../../components/FeatureList.vue';

describe('FeatureList', () => {
    const items = [
        { title: 'Wireless Internet', icon: 'fa-wifi' },
        { title: 'TV', icon: 'fa-television' },
    ];

    it('renderiza el título y un item por cada elemento (AC amenities/precios)', () => {
        const wrapper = mount(FeatureList, {
            props: { title: 'Amenities', items },
            slots: {
                default: `<template #default="item"><span class="item-title">{{ item.title }}</span></template>`,
            },
        });
        expect(wrapper.find('.title strong').text()).toBe('Amenities');
        const itemTitles = wrapper.findAll('.item-title');
        expect(itemTitles).toHaveLength(2);
        expect(itemTitles[0].text()).toBe('Wireless Internet');
        expect(itemTitles[1].text()).toBe('TV');
    });

    it('no renderiza items cuando la lista está vacía', () => {
        const wrapper = mount(FeatureList, {
            props: { title: 'Prices', items: [] },
            slots: { default: '<span>X</span>' },
        });
        expect(wrapper.findAll('.list-item')).toHaveLength(0);
        expect(wrapper.find('.title strong').text()).toBe('Prices');
    });
});
