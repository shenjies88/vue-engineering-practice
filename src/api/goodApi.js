import axiosConfig from '@/config/axiosConfig'

export default {
    list: function (params) {
        return axiosConfig.get('/goods', {
            params
        })
    },
    delete: function (id) {
        return axiosConfig.delete(`goods/${id}`)
    },
    add: function (data) {
        return axiosConfig.post('/goods', data)
    }
}
