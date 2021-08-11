import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import installElementPlus from './plugins/element'
import axios from "./plugins/axios"
import "./assets/css/global.css"

const app = createApp(App)
installElementPlus(app)
app.use(router).use(axios).mount('#app')