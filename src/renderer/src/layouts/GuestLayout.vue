<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-success">
        <div class="container">
            <router-link class="navbar-brand" to="/">
                <i class="fas fa-edit me-2 fw-light"></i>
                <b>Pengisian Survei</b>
            </router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
        </div>
    </nav>
    <main class="my-4">
        <div class="container">
            <slot></slot>
        </div>
    </main>
</template>

<style scoped>
nav {
    border-bottom: 5px solid #1bc766;
}

</style>