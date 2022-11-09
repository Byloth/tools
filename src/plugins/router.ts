import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../pages/HomePage.vue";

export default createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView
        },
        {
            path: "/about",
            name: "about",
            component: () => import("../pages/AboutPage.vue")
        }
    ]
});
