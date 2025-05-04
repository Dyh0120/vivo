import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { createPinia } from 'pinia'
import router from './router/index'
import App from './App.vue'
// 加
import './assets/iconfont/iconfont.css'




const app = createApp(App)
const pinia = createPinia()




app.use(ElementPlus, { locale: zhCn })
// 路由
app.use(router)
app.use(pinia)
app.mount('#app')
// 全局注册图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
