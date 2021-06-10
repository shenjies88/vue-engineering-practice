import axiosConfig from '@/config/axiosConfig'

export default {
    rightList: function (type) {
        return axiosConfig.get(`/rights/${type}`)
    }
}
