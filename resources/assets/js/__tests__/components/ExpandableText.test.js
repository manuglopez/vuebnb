import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ExpandableText from '../../components/ExpandableText.vue';

describe('ExpandableText', () => {
    it('empieza contraído y muestra el botón + More (AC expandir texto)', () => {
        const wrapper = mount(ExpandableText, {
            slots: { default: 'Texto largo de la descripción' },
        });
        const p = wrapper.find('p');
        expect(p.classes()).toContain('contracted');
        expect(wrapper.find('button.more').exists()).toBe(true);
        expect(wrapper.find('button.more').text()).toBe('+ More');
        expect(wrapper.text()).toContain('Texto largo de la descripción');
    });

    it('al pulsar + More expande el texto y oculta el botón', async () => {
        const wrapper = mount(ExpandableText, {
            slots: { default: 'Texto largo de la descripción' },
        });
        await wrapper.find('button.more').trigger('click');
        expect(wrapper.find('p').classes()).not.toContain('contracted');
        expect(wrapper.find('button.more').exists()).toBe(false);
    });
});
