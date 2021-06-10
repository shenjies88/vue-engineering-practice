import axiosConfig from '@/config/axiosConfig'

export default {
    menus: function () {
        return axiosConfig.get('/menus')
    }
}
