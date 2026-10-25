import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import ListingPage from '../../components/ListingPage.vue';
import { useListingStore } from '../../store';

const ImageCarouselStub = { template: '<div class="carousel-stub" />' };

const listing = {
    id: 3,
    title: '2 Bedroom House',
    address: 'Taiwan, Taipei',
    about: 'Come and stay at my home.',
    amenity_wifi: true,
    amenity_tv: true,
    price_per_night: '$84',
    price_extra_people: '$22',
    image_1: 'http://localhost/images/3/Image_1.jpg',
    image_2: 'http://localhost/images/3/Image_2.jpg',
};

function makeRouter() {
    return createRouter({
        history: createMemoryHistory(),
        routes: [
            { path: '/', name: 'home', component: { template: '<div>home</div>' } },
            { path: '/listing/:listing', name: 'listing', component: ListingPage },
        ],
    });
}

describe('ListingPage', () => {
    let router;

    beforeEach(async () => {
        setActivePinia(createPinia());
        const store = useListingStore();
        store.listings = [listing];
        router = makeRouter();
        await router.push('/listing/3');
        await router.isReady();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renderiza el título, la dirección y el enlace de volver (AC detalle)', async () => {
        const wrapper = mount(ListingPage, {
            global: { plugins: [router], stubs: { ImageCarousel: ImageCarouselStub } },
        });
        await flushPromises();
        expect(wrapper.find('h1').text()).toBe('2 Bedroom House');
        expect(wrapper.find('.heading p').text()).toBe('Taiwan, Taipei');
        expect(wrapper.find('.back-link').text()).toContain('Back to list');
    });

    it('muestra las amenidades y precios mapeados', async () => {
        const wrapper = mount(ListingPage, {
            global: { plugins: [router], stubs: { ImageCarousel: ImageCarouselStub } },
        });
        await flushPromises();
        const lists = wrapper.findAllComponents({ name: 'FeatureList' });
        expect(lists[0].props('title')).toBe('Amenities');
        expect(lists[0].props('items')).toEqual([
            { title: 'Wireless Internet', icon: 'fa-wifi' },
            { title: 'TV', icon: 'fa-television' },
        ]);
        expect(lists[1].props('title')).toBe('Prices');
        expect(lists[1].props('items')).toEqual([
            { title: 'Per night', value: '$84' },
            { title: 'Extra people', value: '$22' },
        ]);
    });

    it('abre el modal de imágenes al pulsar la cabecera (AC View Photos)', async () => {
        const wrapper = mount(ListingPage, {
            global: { plugins: [router], stubs: { ImageCarousel: ImageCarouselStub } },
        });
        await flushPromises();
        const header = wrapper.findComponent({ name: 'HeaderImage' });
        await header.vm.$emit('header-clicked');
        await wrapper.vm.$nextTick();
        const modal = wrapper.findComponent({ name: 'ModalWindow' });
        expect(modal.vm.modalOpen).toBe(true);
    });

    it('goBack vuelve a la home cuando no hay historial previo', async () => {
        const wrapper = mount(ListingPage, {
            global: { plugins: [router], stubs: { ImageCarousel: ImageCarouselStub } },
        });
        await flushPromises();
        await wrapper.find('.back-link').trigger('click');
        await flushPromises();
        expect(router.currentRoute.value.name).toBe('home');
    });

    it('goBack usa router.back() cuando hay historial previo', async () => {
        const wrapper = mount(ListingPage, {
            global: { plugins: [router], stubs: { ImageCarousel: ImageCarouselStub } },
        });
        await flushPromises();
        const backSpy = vi.spyOn(router, 'back').mockImplementation(() => {});
        // Simula que se llegó desde otra página (historial con back).
        Object.defineProperty(window.history, 'state', {
            value: { back: '/saved' },
            configurable: true,
        });
        await wrapper.find('.back-link').trigger('click');
        expect(backSpy).toHaveBeenCalled();
        Object.defineProperty(window.history, 'state', {
            value: null,
            configurable: true,
        });
    });
});
