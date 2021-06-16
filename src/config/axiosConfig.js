import axios from 'axios'
import { Message } from 'element-ui'
import config from '@/config/config'
import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

axios.defaults.baseURL = config[process.env.NODE_ENV].baseURL
axios.interceptors.request.use(config => {
    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
axios.interceptors.response.use(response => {
    NProgress.done()
    const {
        status,
        data: res
        } = response
        if (status !== 200) {
            let errorMsg = '网络异常'
            switch (status) {
                case 403:
                    errorMsg = '权限不足'
                    break
                case 404:
                    errorMsg = '路径不存在'
                    break
                case 502:
                    errorMsg = '服务器繁忙'
                    break
            }
            throw new Error(errorMsg)
        }
        const {
            data,
            meta
        } = res
        if (meta.status !== 200 && meta.status !== 201) {
            Message.error(meta.msg)
            if (meta.msg === '无效token') {
                return router.push('/login')
            }
            throw new Error(meta.msg)
        }
        return data
    }, error => {
        Message.error('网络异常')
        return Promise.reject(error)
    }
)

export default axios
