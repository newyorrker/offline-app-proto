import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')

const sessionFromNative = (data: unknown) => {
  console.log(data, "from session from native");
}

window.sessionFromNative = sessionFromNative;
