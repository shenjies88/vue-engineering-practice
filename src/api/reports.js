import axiosConfig from '@/config/axiosConfig'

export default {
    get: function () {
        return axiosConfig.get('/reports/type/1')
    }
}
