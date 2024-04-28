<script setup>

import Logo from '@renderer/assets/logo.png';

</script>

<template>
    <header class="navbar sticky-top flex-md-nowrap p-0 shadow" data-bs-theme="dark">

        <div>
            <router-link class="navbar-brand col-md-3 col-lg-2 me-0 fs-6 text-white text-center fw-semibold" to="/">
                <img src="@renderer/assets/logo.png" alt="" style="height: 50px">

                Survei IKRN
            </router-link>
        </div>

        <ul class="navbar-nav flex-row d-md-none">
            <li class="nav-item text-nowrap">
                <button class="nav-link px-3 text-white" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSearch" aria-controls="navbarSearch" aria-expanded="false"
                    aria-label="Toggle search">
                    <svg class="bi">
                        <use xlink:href="#search" />
                    </svg>
                </button>
            </li>
            <li class="nav-item text-nowrap">
                <button class="nav-link px-3 text-white" type="button" data-bs-toggle="offcanvas"
                    data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <i class="fas fa-bars"></i>
                </button>
            </li>
        </ul>

        <div id="navbarSearch" class="navbar-search w-100 collapse">
            <input class="form-control w-100 rounded-0 border-0" type="text" placeholder="Search" aria-label="Search">
        </div>
    </header>
</template>

<style scoped>
header {
    background-color: var(--header-bg);
}

header .navbar-brand {
    padding: 1rem 1.55rem;
    background-color: rgb(0 0 0 / 10%);
}

.navbar .form-control {
    padding: 0.75rem 1rem;
}
</style>
