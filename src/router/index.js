import { createRouter, createWebHashHistory } from "vue-router";
// import pages
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import Welcome from "../components/Welcome.vue";
import Users from "../components/user/Users.vue";

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
    redirect: "/welcome",
    children: [{ path: "/welcome", component: Welcome }, {path:"/users", component: Users}],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// /!\ route guard for authorized paths
router.beforeEach((to, from, next) => {
  // if going directly to login page, do nothing
  if (to.path === "/login") return next();

  // for other pages, check for authentication

  //  try to get auth token
  const tokenStr = window.sessionStorage.getItem("token");

  // if there isn't authentication token, redirect to login page
  if (!tokenStr) return next("/login");

  // if there is a token, let go to the page
  next();
});

export default router;
