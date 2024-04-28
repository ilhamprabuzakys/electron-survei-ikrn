<template>
    <div class="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
        <div class="offcanvas-md offcanvas-end bg-body-tertiary" tabindex="-1" id="sidebarMenu"
            aria-labelledby="sidebarMenuLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="sidebarMenuLabel">--DATA--</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu"
                    aria-label="Close"></button>
            </div>
            <div class="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 ps-3 overflow-y-auto">
                <h6
                    class="sidebar-heading d-flex justify-content-between align-items-center px-3 mb-1 text-body-secondary text-uppercase">
                    <span>MENU</span>
                    <a class="link-secondary" href="#" aria-label="Add a new report">
                        <svg class="bi">
                            <use xlink:href="#plus-circle" />
                        </svg>
                    </a>
                </h6>

                <ul class="nav flex-column">
                    <li class="nav-item">
                        <router-link class="nav-link d-flex align-items-center gap-2" to="/">
                            <i class="bi-house"></i>
                            Data Survei
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link d-flex align-items-center gap-2" to="/admin">
                            <i class="bi-pencil-square"></i>
                            Survei Admin
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link d-flex align-items-center gap-2" to="/database">
                            <i class="bi-database"></i>
                            Database Survei
                        </router-link>
                    </li>
                </ul>

            </div>
        </div>
    </div>
</template>

<style scoped>
.sidebar .nav-link {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--sidebar-nav-link);
}

.sidebar .nav-link:hover {
    color: var(--sidebar-nav-link-active);
}

.sidebar .nav-link.active {
    font-weight: 700;
    color: var(--sidebar-nav-link-active);
}

.sidebar-heading {
    font-size: 0.75rem;
}

@media (min-width: 768px) {
    .sidebar .offcanvas-lg {
        position: -webkit-sticky;
        position: sticky;
        top: 48px;
    }

    .navbar-search {
        display: block;
    }
}
</style>