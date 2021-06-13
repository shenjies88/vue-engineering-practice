import axiosConfig from '@/config/axiosConfig'

export default {
    list: function (queryInfo) {
        return axiosConfig.get('/categories', {
            params: queryInfo
        })
    },
    add: function (body) {
        return axiosConfig.post('/categories', body)
    },
    update: function (id, cat_name) {
        return axiosConfig.put(`/categories/${id}`, {
            cat_name
        })
    },
    delete: function (id) {
        return axiosConfig.delete(`/categories/${id}`)
    }
}
