import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import ImageCarousel from '../../components/ImageCarousel.vue';

describe('ImageCarousel', () => {
    const images = [
        'http://localhost/images/3/Image_1.jpg',
        'http://localhost/images/3/Image_2.jpg',
        'http://localhost/images/3/Image_3.jpg',
    ];

    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('muestra la primera imagen al montar (AC carrusel)', () => {
        const wrapper = mount(ImageCarousel, { props: { images } });
        expect(wrapper.find('img').attributes('src')).toBe(images[0]);
    });

    it('avanza a la siguiente imagen al pulsar la flecha derecha', async () => {
        const wrapper = mount(ImageCarousel, { props: { images } });
        const controls = wrapper.findAllComponents({ name: 'CarouselControl' });
        await controls[1].trigger('click');
        expect(wrapper.find('img').attributes('src')).toBe(images[1]);
    });

    it('retrocede a la imagen anterior al pulsar la flecha izquierda', async () => {
        const wrapper = mount(ImageCarousel, { props: { images } });
        const controls = wrapper.findAllComponents({ name: 'CarouselControl' });
        await controls[0].trigger('click');
        // Desde el índice 0, izquierda envuelve a la última imagen.
        expect(wrapper.find('img').attributes('src')).toBe(images[2]);
    });

    it('envuelve de la última a la primera al seguir avanzando', async () => {
        const wrapper = mount(ImageCarousel, { props: { images } });
        const controls = wrapper.findAllComponents({ name: 'CarouselControl' });
        // Avanza 3 veces: 0 -> 1 -> 2 -> 0.
        await controls[1].trigger('click');
        await controls[1].trigger('click');
        await controls[1].trigger('click');
        expect(wrapper.find('img').attributes('src')).toBe(images[0]);
    });

    it('retrocede del índice 1 al 0 sin envolver a la última', async () => {
        const wrapper = mount(ImageCarousel, { props: { images } });
        const controls = wrapper.findAllComponents({ name: 'CarouselControl' });
        await controls[1].trigger('click');
        expect(wrapper.find('img').attributes('src')).toBe(images[1]);
        await controls[0].trigger('click');
        expect(wrapper.find('img').attributes('src')).toBe(images[0]);
    });
});
