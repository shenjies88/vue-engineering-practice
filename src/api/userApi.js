import axiosConfig from '@/config/axiosConfig'

export default {
    addUser: function (userInfo) {
        return axiosConfig.post('/users', userInfo)
    },
    userStateChange(id, mgState) {
        return axiosConfig.put(`/users/${id}/state/${mgState}`)
    },
    userList(queryParams) {
        return axiosConfig.get('/users', {
            params: queryParams
        })
    },
    getById(id) {
        return axiosConfig.get(`/users/${id}`)
    },
    updateUser: function (userInfo) {
        return axiosConfig.put(`/users/${userInfo.id}`, userInfo)
    }
}
