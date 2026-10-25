<template>
    <div class="listing-summary-group">
        <h1>Places in {{ country }}</h1>
        <div class="listing-carousel">
            <div class="controls">
                <carousel-control dir="left" @change-image="change" :style="leftArrowStyle"></carousel-control>
                <carousel-control dir="right" @change-image="change" :style="rightArrowStyle"></carousel-control>
            </div>
            <div class="listing-summaries-wrapper">
                <div class="listing-summaries" :style="style">
                    <listing-summary
                            v-for="listing in listings"
                            :listing="listing"
                            :key="listing.id"
                    ></listing-summary>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ListingSummary from './ListingSummary.vue';
import CarouselControl from './CarouselControl.vue';

const props = defineProps(['country', 'listings']);

const rowSize = 3;
const listingSummaryWidth = 365;
const offset = ref(0);

const change = (val) => {
    let newVal = offset.value + parseInt(val);
    if (newVal >= 0 && newVal <= props.listings.length - rowSize) {
        offset.value = newVal;
    }
};

const style = computed(() => {
    return {transform: `translateX(${offset.value * -listingSummaryWidth}px)`};
});

const leftArrowStyle = computed(() => {
    return {visibility: (offset.value > 0 ? 'visible' : 'hidden')};
});

const rightArrowStyle = computed(() => {
    return {
        visibility: (
            offset.value < (props.listings.length - rowSize)
                ? 'visible' : 'hidden'
        )
    };
});
</script>

<style>
    .listing-summary-group {
        padding-bottom: 20px;
    }

    .listing-summaries-wrapper {
        overflow: hidden;
    }

    .listing-carousel {
        position: relative;
    }

    .listing-carousel .controls {
        display: flex;
        justify-content: space-between;
        position: absolute;
        top: calc(50% - 45px);
        left: -45px;
        width: calc(100% + 90px);
    }

    .listing-carousel .controls .carousel-control {
        color: #c5c5c5;
        font-size: 1.5rem;
        cursor: pointer;
    }

    .listing-summaries {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        transition: transform 0.5s;
    }

    .listing-summaries > .listing-summary {
        margin-right: 15px;
    }

    .listing-summaries > .listing-summary:last-child {
        margin-right: 0;
    }
</style>