import axios from "axios";
import serverConfig from '../config.json';

let user = localStorage.getItem("user") || '{}'
let userJson = JSON.parse(user)
let token = userJson.accessToken
// import SERVER_URL from '../config.json'

const api = axios.create({
    baseURL: serverConfig.SERVER_URL+'api/',
    headers: {
        'Authorization' : `${token}`,
        'ngrok-skip-browser-warning' : true,
        "User-Agent": "MyCustomUserAgent"
        
    }
})

export default api;