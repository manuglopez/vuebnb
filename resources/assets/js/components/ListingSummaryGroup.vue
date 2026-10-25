<template>
    <section class="listing-summary-group">
        <h1>Places in {{ country }}</h1>
        <div class="listing-grid">
            <listing-summary
                    v-for="listing in listings"
                    :listing="listing"
                    :key="listing.id"
            ></listing-summary>
        </div>
    </section>
</template>

<script setup>
import ListingSummary from './ListingSummary.vue';

defineProps(['country', 'listings']);
</script>
