import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import ModalWindow from '../../components/ModalWindow.vue';

describe('ModalWindow', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        document.body.classList.remove('modal-open');
    });

    afterEach(() => {
        document.body.classList.remove('modal-open');
    });

    it('empieza cerrado sin la clase show (AC modal)', () => {
        const wrapper = mount(ModalWindow, { slots: { default: '<div>contenido</div>' } });
        expect(wrapper.find('#modal').classes()).not.toContain('show');
        expect(wrapper.find('.modal-content').text()).toBe('contenido');
    });

    it('abre el modal al poner modalOpen a true y añade la clase al body', async () => {
        const wrapper = mount(ModalWindow, { slots: { default: '<div>contenido</div>' } });
        wrapper.vm.modalOpen = true;
        await wrapper.vm.$nextTick();
        expect(wrapper.find('#modal').classes()).toContain('show');
        expect(document.body.classList.contains('modal-open')).toBe(true);
    });

    it('cierra el modal con el botón de cierre y quita la clase del body', async () => {
        const wrapper = mount(ModalWindow, { slots: { default: '<div>contenido</div>' } });
        wrapper.vm.modalOpen = true;
        await wrapper.vm.$nextTick();
        await wrapper.find('button.modal-close').trigger('click');
        expect(wrapper.find('#modal').classes()).not.toContain('show');
        expect(document.body.classList.contains('modal-open')).toBe(false);
    });

    it('cierra el modal al pulsar la tecla Escape', async () => {
        const wrapper = mount(ModalWindow, { slots: { default: '<div>contenido</div>' } });
        wrapper.vm.modalOpen = true;
        await wrapper.vm.$nextTick();
        document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 27 }));
        await wrapper.vm.$nextTick();
        expect(wrapper.find('#modal').classes()).not.toContain('show');
    });

    it('no cierra el modal con una tecla distinta de Escape', async () => {
        const wrapper = mount(ModalWindow, { slots: { default: '<div>contenido</div>' } });
        wrapper.vm.modalOpen = true;
        await wrapper.vm.$nextTick();
        document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 65 }));
        await wrapper.vm.$nextTick();
        expect(wrapper.find('#modal').classes()).toContain('show');
    });

    it('quita el listener de teclado al desmontar', async () => {
        const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
        const wrapper = mount(ModalWindow, { slots: { default: '<div>contenido</div>' } });
        wrapper.vm.modalOpen = true;
        await wrapper.vm.$nextTick();
        wrapper.unmount();
        expect(removeEventListenerSpy).toHaveBeenCalledWith('keyup', expect.any(Function));
        removeEventListenerSpy.mockRestore();
    });
});
