import { createRouter, createWebHashHistory } from 'vue-router'
// import pages
import Login from "../views/Login.vue"

const routes = [
  // redirect to "/login" on root path
  {
    path:"/",
    redirect: "/login"
  },
  {
    path:"/login",
    component: Login,

  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
