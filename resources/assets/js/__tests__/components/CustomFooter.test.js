import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CustomFooter from '../../components/CustomFooter.vue';

describe('CustomFooter', () => {
    it('renderiza el texto del pie de página (AC layout)', () => {
        const wrapper = mount(CustomFooter);
        expect(wrapper.find('#footer').exists()).toBe(true);
        expect(wrapper.text()).toContain('Vuebnb');
        expect(wrapper.text()).toContain('A full-stack Vue.js and Laravel demo app');
    });
});
