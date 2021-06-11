import axiosConfig from '@/config/axiosConfig'

export default {
    rolesList: function () {
        return axiosConfig.get('/roles')
    },
    deleteRight: function (rolesId, rightsId) {
        return axiosConfig.delete(`/roles/${rolesId}/rights/${rightsId}`)
    }
}
