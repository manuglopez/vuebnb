<template>
    <div class="listing-container">
        <a href="/" class="back-link" @click.prevent="goBack">
            <i class="fa fa-chevron-left" aria-hidden="true"></i> Back to list
        </a>
        <header-image
                v-if="listing.images && listing.images[0]"
                :image-url="listing.images[0]"
                :id="listing.id"
                @header-clicked="openModal"
        ></header-image>
        <div class="listing-body">
            <div class="heading">
                <h1>{{ listing.title }}</h1>
                <p>{{ listing.address }}</p>
            </div>
            <hr>
            <div class="about">
                <h3>About this listing</h3>
                <expandable-text>{{ listing.about }}</expandable-text>
            </div>
            <div class="lists">
                <feature-list title="Amenities" :items="listing.amenities">
                    <template #default="amenity">
                        <i class="fa fa-lg" :class="amenity.icon"></i>
                        <span>{{ amenity.title }}</span>
                    </template>
                </feature-list>
                <feature-list title="Prices" :items="listing.prices">
                    <template #default="price">
                        {{ price.title }}: <strong>{{ price.value }}</strong>
                    </template>
                </feature-list>
            </div>
        </div>
        <modal-window ref="imagemodal">
            <image-carousel :images="listing.images"></image-carousel>
        </modal-window>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { populateAmenitiesAndPrices } from '../helpers';
import ImageCarousel from './ImageCarousel.vue';
import ModalWindow from './ModalWindow.vue';
import FeatureList from './FeatureList.vue';
import HeaderImage from './HeaderImage.vue';
import ExpandableText from './ExpandableText.vue';
import { useListingStore } from '../store';

const listingStore = useListingStore();

const route = useRoute();
const router = useRouter();

// Vuelve a la lista de la que vienes (home o saved) conservando el scroll; si se entró directo, va a la home.
const goBack = () => {
    if (window.history.state && window.history.state.back) {
        router.back();
    } else {
        router.push({ name: 'home' });
    }
};

const listing = computed(() => {
    return populateAmenitiesAndPrices(listingStore.getListing(route.params.listing));
});

const imagemodal = ref(null);

const openModal = () => {
    imagemodal.value.modalOpen = true;
};
</script>

<style>
.about {
    margin: 2em 0;
}

.about h3 {
    font-size: 22px;
}
</style>