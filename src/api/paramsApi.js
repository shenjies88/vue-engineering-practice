import axiosConfig from '@/config/axiosConfig'

export default {
    list: function (id, sel) {
        return axiosConfig.get(`categories/${id}/attributes`, {
            params: {
                sel
            }
        })
    },
    add: function (id, attr_name, attr_sel) {
        return axiosConfig.post(`categories/${id}/attributes`, {
            attr_name,
            attr_sel
        })
    },
    update: function (id, attrId, attr_name, attr_sel) {
        return axiosConfig.put(`categories/${id}/attributes/${attrId}`, {
            attr_name,
            attr_sel
        })
    }
}
