import axiosConfig from '@/config/axiosConfig'

export default {
    list: function (queryInfo) {
        return axiosConfig.get('/categories', {
            params: queryInfo
        })
    }
}
