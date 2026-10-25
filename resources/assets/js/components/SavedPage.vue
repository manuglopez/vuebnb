<template>
    <div id="saved" class="home-container">
        <h2>Saved listings</h2>
        <div v-if="listings.length" class="listing-summaries">
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

<style>
    #saved .listing-summaries {
        display: flex;
        flex-wrap: wrap;
        justify-content: left;
        overflow: hidden;
    }

    #saved .listing-summaries .listing-summary {
        padding-bottom: 30px;
    }

    .listing-summaries > .listing-summary {
        margin-right: 15px;
    }
</style>