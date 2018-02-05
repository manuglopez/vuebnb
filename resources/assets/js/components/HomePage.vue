<template>
    <div class="home-container">
        <div v-for="(group, country) in listing_groups" class="listing-summary-group">
            <h1>Places in {{ country }}</h1>
            <div class="listing-summaries">
                <listing-summary
                        v-for="listing in group"
                        :key="listing.id"
                        :listing="listing"
                ></listing-summary>
            </div>
        </div>
    </div>
</template>
<script>
    import {groupByCountry} from '../helpers';

    let serverData = JSON.parse(window.server_data).listings;
    let listing_groups = groupByCountry(serverData);
    import ListingSummary from './ListingSummary.vue';

    export default {
        data() {
            return {
                listing_groups: []
            };
        },
        components: {
            ListingSummary
        },
        beforeRouteEnter(to, from, next) {
            let serverData = JSON.parse(window.server_data);
            if (to.path === serverData.path) {
                let listing_groups = groupByCountry(serverData.listings);
                next(component => component.listing_groups = listing_groups);
            } else {
                console.log('Need to get data with AJAX!');
                next(false);
            }
        }
    }
</script>
<style>
    .home-container {
        margin: 0 auto;
        padding: 0 25px;
    }

    @media (min-width: 1131px) {
        .home-container {
            width: 1080px;
        }
    }

    .listing-summary-group {
        padding-bottom: 20px;
    }

    .listing-summaries {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        overflow: hidden;
    }
    .listing-summaries > .listing-summary {
        margin-right: 15px;
    }
    .listing-summaries > .listing-summary:last-child {

        margin-right: 0;
    }
</style>