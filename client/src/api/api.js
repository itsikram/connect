import axios from "axios";

let user = localStorage.getItem("user") || '{}'
let userJson = JSON.parse(user)
let token = userJson.accessToken

console.log(window.navigator.connection)
const api = axios.create({
    baseURL: process.env.REACT_APP_SERVER_ADDR+'/api/',
    headers: {
        'Authorization' : `${token}`,
        'ngrok-skip-browser-warning' : true,
        "User-Agent": "MyCustomUserAgent"
        
    }
})


export default api;