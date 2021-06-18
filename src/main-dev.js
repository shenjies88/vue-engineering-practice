import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/icon/iconfont.css'

Vue.config.productionTip = false

Vue.filter('timestampToTime', function (timestamp) {
    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const date = new Date(timestamp * 1000)
    const Y = date.getFullYear() + '-'
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    const D = date.getDate() + ' '
    const h = date.getHours() + ':'
    const m = date.getMinutes() + ':'
    const s = date.getSeconds()
    return Y + M + D + h + m + s
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
