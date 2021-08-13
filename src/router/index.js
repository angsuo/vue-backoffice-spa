import { createRouter, createWebHashHistory } from "vue-router";
// import pages
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";

const routes = [
  // redirect to "/login" on root path
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/home",
    component: Home,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// /!\ Order of NavigationGuard's [to] & [from]
router.beforeEach((to, from, next) => {
  // if going directly to login page, do nothing
  if (to.path === "/login") return next();

  // for other pages, check for authentication

  //  try to get auth token
  const tokenStr = window.sessionStorage.getItem("token")

  // if there isn't authentication token, redirect to login page
  if (!tokenStr)return next("/login");

  // if there is a token, let go to the page
  next();
});

export default router;
