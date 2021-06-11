import axiosConfig from '@/config/axiosConfig'

export default {
    rolesList: function () {
        return axiosConfig.get('/roles')
    }
}
