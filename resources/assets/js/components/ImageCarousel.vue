<template>
    <div class="image-carousel">
        <img v-bind:src="image"/>
        <div class="controls">
            <carousel-control dir="left" @change-image="changeImage"></carousel-control>
            <carousel-control dir="right" @change-image="changeImage"></carousel-control>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CarouselControl from './CarouselControl.vue';

const emit = defineEmits(['change-image']);

const props = defineProps(['images']);

const index = ref(0);

const image = computed(() => {
    return props.images[index.value];
});

const changeImage = (val) => {
    let newVal = index.value + parseInt(val);
    if (newVal < 0) {
        index.value = props.images.length - 1;
    } else if (newVal === props.images.length) {
        index.value = 0;
    } else {
        index.value = newVal;
    }
};
</script>

<style>
    .image-carousel {
        height: 100%;
        margin-top: -12vh;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .image-carousel img {
        width: 100%;
    }

    .image-carousel .controls {
        position: absolute;
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
</style>