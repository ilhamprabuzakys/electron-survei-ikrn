<script setup>
defineProps(['title', 'icon']);
</script>

<template>
    <div class="row border-bottom" :class="$slots.action ? 'pb-3' : 'pb-2'">
        <div class="col-lg-7">
            <h4>{{ title }} <i :class="icon"></i></h4>
        </div>
        <div class="col-lg-5 d-flex justify-content-end">
            <slot name="action"></slot>
        </div>
    </div>
</template>