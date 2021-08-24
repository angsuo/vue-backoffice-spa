import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import installElementPlus from './plugins/element'
import axios from "./plugins/axios"
import "./assets/css/global.css"

// Quill editor import
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const app = createApp(App)

app.component('Quill', QuillEditor)

installElementPlus(app)
app.use(router).use(axios).mount('#app')