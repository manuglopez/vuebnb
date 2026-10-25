import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CarouselControl from '../../components/CarouselControl.vue';

describe('CarouselControl', () => {
    it('renderiza la clase de flecha según la prop dir (AC carrusel)', () => {
        const left = mount(CarouselControl, { props: { dir: 'left' } });
        expect(left.classes()).toContain('fa-chevron-left');
        expect(left.classes()).toContain('carousel-control');

        const right = mount(CarouselControl, { props: { dir: 'right' } });
        expect(right.classes()).toContain('fa-chevron-right');
    });

    it('emite change-image con -1 al pulsar la flecha izquierda', async () => {
        const wrapper = mount(CarouselControl, { props: { dir: 'left' } });
        await wrapper.trigger('click');
        expect(wrapper.emitted('change-image')).toBeTruthy();
        expect(wrapper.emitted('change-image')[0]).toEqual([-1]);
    });

    it('emite change-image con +1 al pulsar la flecha derecha', async () => {
        const wrapper = mount(CarouselControl, { props: { dir: 'right' } });
        await wrapper.trigger('click');
        expect(wrapper.emitted('change-image')[0]).toEqual([1]);
    });
});
