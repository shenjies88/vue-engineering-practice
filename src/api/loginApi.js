import axiosConfig from '@/config/axiosConfig'

export default {
    login: function (loginForm) {
        return axiosConfig.post('/login', loginForm)
    }
}
