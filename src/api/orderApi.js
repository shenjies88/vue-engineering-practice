import axiosConfig from '@/config/axiosConfig'

export default {
    list: function (params) {
        return axiosConfig.get('/orders', {
            params
        })
    },
    kuaidi: function () {
        return axiosConfig.get('/kuaidi/YT2121759417580')
    }
}
