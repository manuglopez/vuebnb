import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import App from '../../components/App.vue';

describe('App', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('renderiza la barra de herramientas con el título y el enlace a Saved (AC layout)', () => {
        const wrapper = mount(App, {
            global: {
                stubs: {
                    'router-link': { template: '<a><slot /></a>' },
                    'router-view': { template: '<div class="router-view-stub" />' },
                },
            },
        });
        expect(wrapper.find('#toolbar h1').text()).toBe('vuebnb');
        expect(wrapper.find('#toolbar').text()).toContain('Saved');
        expect(wrapper.findComponent({ name: 'CustomFooter' }).exists()).toBe(true);
    });
});
