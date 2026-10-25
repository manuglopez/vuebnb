import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import ListingSave from '../../components/ListingSave.vue';
import { useListingStore } from '../../store';

describe('ListingSave', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('muestra "Save" y corazón vacío para un id no guardado', () => {
        const wrapper = mount(ListingSave, { props: { id: 2, button: true } });
        expect(wrapper.find('button').text()).toBe('Save');
        expect(wrapper.find('i').classes()).toContain('fa');
        expect(wrapper.find('i').classes()).toContain('fa-lg');
        expect(wrapper.find('i').classes()).toContain('fa-heart-o');
        expect(wrapper.find('i').classes()).not.toContain('fa-heart');
    });

    it('muestra "Saved" y corazón lleno para un id guardado', () => {
        const wrapper = mount(ListingSave, { props: { id: 1, button: true } });
        expect(wrapper.find('button').text()).toBe('Saved');
        expect(wrapper.find('i').classes()).toContain('fa');
        expect(wrapper.find('i').classes()).toContain('fa-lg');
        expect(wrapper.find('i').classes()).toContain('fa-heart');
    });

    it('al pulsar guarda el id en el store (AC favoritos)', async () => {
        const store = useListingStore();
        const wrapper = mount(ListingSave, { props: { id: 2, button: true } });
        await wrapper.find('button').trigger('click');
        expect(store.saved).toContain(2);
        expect(wrapper.find('button').text()).toBe('Saved');
    });

    it('al pulsar un id ya guardado lo quita del store', async () => {
        const store = useListingStore();
        const wrapper = mount(ListingSave, { props: { id: 1, button: true } });
        await wrapper.find('button').trigger('click');
        expect(store.saved).not.toContain(1);
        expect(wrapper.find('button').text()).toBe('Save');
    });

    it('sin prop button renderiza solo el icono (sin botón)', () => {
        const wrapper = mount(ListingSave, { props: { id: 1 } });
        expect(wrapper.find('button').exists()).toBe(false);
        expect(wrapper.find('i').exists()).toBe(true);
    });
});
