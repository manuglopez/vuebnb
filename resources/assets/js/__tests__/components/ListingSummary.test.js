import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import ListingSummary from '../../components/ListingSummary.vue';

const listing = {
    id: 3,
    title: '2 Bedroom House',
    address: 'Taiwan, Taipei',
    price_per_night: '$84',
    thumb: 'http://localhost/images/3/Image_1.jpg',
};

describe('ListingSummary', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('renderiza título, dirección y precio por noche (AC rejilla)', () => {
        const wrapper = mount(ListingSummary, {
            props: { listing },
            global: {
                stubs: { 'router-link': { template: '<a><slot /></a>' } },
            },
        });
        expect(wrapper.find('.info.title').text()).toBe('2 Bedroom House');
        expect(wrapper.find('.info.address').text()).toBe('Taiwan, Taipei');
        expect(wrapper.find('.info.price').text()).toContain('$84');
        expect(wrapper.find('.info.price').text()).toContain('night');
    });

    it('aplica la imagen de fondo de la miniatura', () => {
        const wrapper = mount(ListingSummary, {
            props: { listing },
            global: {
                stubs: { 'router-link': { template: '<a><slot /></a>' } },
            },
        });
        expect(wrapper.find('.thumbnail').attributes('style')).toContain('http://localhost/images/3/Image_1.jpg');
    });

    it('enlaza a la ruta de detalle del listing', () => {
        const wrapper = mount(ListingSummary, {
            props: { listing },
            global: {
                stubs: {
                    'router-link': {
                        props: ['to'],
                        template: '<a :href="to.name"><slot /></a>',
                    },
                },
            },
        });
        const link = wrapper.find('a');
        expect(link.attributes('href')).toBe('listing');
    });
});
