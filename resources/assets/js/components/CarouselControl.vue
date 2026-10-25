<template>
    <i :class="classes" @click="clicked"></i>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['dir']);

const classes = computed(() => {
    return 'carousel-control fa fa-2x fa-chevron-' + props.dir;
});

const emit = defineEmits(['change-image']);

const clicked = () => {
    emit('change-image', props.dir === 'left' ? -1 : 1);
};
</script>

<style>
    .carousel-control {
        padding: 1rem;
        color: #ffffff;
        opacity: 0.85
    }

    @media (min-width: 744px) {
        .carousel-control {
            font-size: 3rem;
        }
    }
</style>