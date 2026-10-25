import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import HeaderImage from '../../components/HeaderImage.vue';

describe('HeaderImage', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('aplica la imagen de fondo y emite header-clicked al pulsar (AC View Photos)', async () => {
        const wrapper = mount(HeaderImage, {
            props: { imageUrl: 'http://localhost/images/3/Image_1.jpg', id: 3 },
        });
        const img = wrapper.find('.header-img');
        expect(img.attributes('style')).toContain('http://localhost/images/3/Image_1.jpg');
        expect(wrapper.find('button.view-photos').text()).toBe('View Photos');

        await img.trigger('click');
        expect(wrapper.emitted('header-clicked')).toBeTruthy();
    });

    it('renderiza el botón de guardar con el id del listing', () => {
        const wrapper = mount(HeaderImage, {
            props: { imageUrl: 'http://localhost/images/3/Image_1.jpg', id: 3 },
        });
        const save = wrapper.findComponent({ name: 'ListingSave' });
        expect(save.exists()).toBe(true);
        expect(save.props('id')).toBe(3);
        expect(save.props('button')).toBe(true);
    });
});
