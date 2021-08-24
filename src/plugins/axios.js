import axios from "axios"

// set base requests URL
// If need to change: change in the AddProduct component aswell for the picture upload
axios.defaults.baseURL="http://timemeetyou.com:8889/api/private/v1/"

// set request headers with authorization token
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem("token")
    return config
})

export default {
    install: (app) => {
        app.provide("axios", axios)
    }
}