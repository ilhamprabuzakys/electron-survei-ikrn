<script setup>
import Header from '@renderer/layouts/partials/Header.vue';
import Sidebar from '@renderer/layouts/partials/Sidebar.vue';
</script>

<template>

    <Header />

    <div class="container-fluid">
        <div class="row">

            <Sidebar />

            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 mt-4">
                <slot />
            </main>
        </div>
    </div>
</template>
