<template>
    <div id="saved" class="home-container">
        <h2>Saved listings</h2>
        <div v-if="listings.length" class="listing-grid">
            <listing-summary
                    v-for="listing in listings"
                    :listing="listing"
                    :key="listing.id"
            ></listing-summary>
        </div>
        <div v-else>No saved listings.</div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import ListingSummary from './ListingSummary.vue';
import { useListingStore } from '../store';

const listingStore = useListingStore();

const listings = computed(() => {
    return listingStore.listing_summaries.filter(
        item => listingStore.saved.indexOf(item.id) > -1
    );
});
</script>
