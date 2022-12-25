import { createApp } from 'vue'
import './style.css'
import App from './App.vue' 
//@ts-ignore
import AutoTest from "../../../dist/index";

console.log(AutoTest);

const app = createApp(App)

app.mount('#app')
