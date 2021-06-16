module.exports = {
    lintOnSave: false,
    chainWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            config.entry('app').clear().add('./src/main-prod.js')

            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'nprogress',
                'vue-quill-editor': 'VueQuillEditor'
            })
        } else {
            // 为开发环境修改配置...
            config.entry('app').clear().add('./src/main-dev.js')
        }
    }
}
