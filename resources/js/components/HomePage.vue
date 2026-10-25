<template>
    <div class="home-container">
        <listing-summary-group
                v-for="(group, country) in listing_groups"
                :key="country"
                :listings="group"
                :country="country"
                class="listing-summary-group"
        ></listing-summary-group>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { groupByCountry } from '../helpers';
import ListingSummaryGroup from './ListingSummaryGroup.vue';
import { useListingStore } from '../store';

const listingStore = useListingStore();

const listing_groups = computed(() => {
    return groupByCountry(listingStore.listing_summaries);
});
</script>