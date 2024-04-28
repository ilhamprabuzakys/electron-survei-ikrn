import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";

import MainLayout from '@renderer/layouts/MainLayout.vue';
import GuestLayout from '@renderer/layouts/GuestLayout.vue';

const APP_NAME = 'Kelola Data Survei';

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Data Survei",
            component: () => import("@renderer/views/SurveiView.vue"),
            meta: { layout: MainLayout }
        },
        {
            path: "/admin",
            name: "Pengelolaan Data Survei",
            component: () => import("@renderer/views/AdminView.vue"),
            meta: { layout: MainLayout }
        },
        {
            path: "/database",
            name: "Database Survei",
            component: () => import("@renderer/views/DatabaseSurveiView.vue"),
            meta: { layout: MainLayout }
        },
        {
            path: "/pengisian/:id",
            name: "Pengisian Survei",
            component: () => import("@renderer/views/PengisianSurveiView.vue"),
            meta: { layout: GuestLayout }
        },
        {
            path: "/hasil/survei/:kode/:id",
            name: "Hasil Pengisian Survei",
            component: () => import("@renderer/views/HasilPengisianSurveiView.vue"),
            meta: { layout: GuestLayout }
        },
        {
            path: "/hasil/responden/:id",
            name: "Hasil Pengisian Survei Responden",
            component: () => import("@renderer/views/HasilPengisianSurveiRespondenView.vue"),
            meta: { layout: GuestLayout }
        },


    ],
    linkActiveClass: 'active',
    linkExactActiveClass: 'exact-active',
});

router.beforeEach((to, from, next) => {
    document.title = `${to.name} - ${APP_NAME}`;
    next();
});

export default router;
