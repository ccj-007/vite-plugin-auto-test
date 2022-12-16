import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
//@ts-ignore
import AutoTest from "../../../dist";

const app = createApp(App)
app.use(AutoTest)

app.mount('#app')
