<template>
    <div>
        <header-image
                v-if="listing.images && listing.images[0]"
                :image-url="listing.images[0]"
                :id="listing.id"
                @header-clicked="openModal"
        ></header-image>
        <div class="listing-container">
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
                    <template #amenity="{ item: amenity }">
                        <i class="fa fa-lg" :class="amenity.icon"></i>
                        <span>{{ amenity.title }}</span>
                    </template>
                </feature-list>
                <feature-list title="Prices" :items="listing.prices">
                    <template #price="{ item: price }">
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
import { populateAmenitiesAndPrices } from '../helpers';
import ImageCarousel from './ImageCarousel.vue';
import ModalWindow from './ModalWindow.vue';
import FeatureList from './FeatureList.vue';
import HeaderImage from './HeaderImage.vue';
import ExpandableText from './ExpandableText.vue';
import { useListingStore } from '../store';

const listingStore = useListingStore();

const state = ref(JSON.parse(window.server_data).listing);

const listing = computed(() => {
    return populateAmenitiesAndPrices(listingStore.getListing(state.value.id));
});

const openModal = () => {
    // Emit the modal open event
    emit('open-modal');
};

const emit = defineEmits(['open-modal']);
</script>

<style>
.about {
    margin: 2em 0;
}

.about h3 {
    font-size: 22px;
}
</style>