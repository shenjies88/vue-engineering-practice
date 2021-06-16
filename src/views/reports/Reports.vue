<template>
    <el-card>
        <div id="main" style="margin: auto; width: 600px; height: 400px"></div>
    </el-card>
</template>

<script>
import * as echarts from 'echarts'
import reports from '@/api/reports'

export default {
    name: 'Reports',
    data() {
        return {
            option: {}
        }
    },
    mounted() {
        const myChart = echarts.init(document.getElementById('main'))
        reports.get().then(res => {
            myChart.setOption(res)
        })
    }

}
</script>

<style lang="less" scoped>
</style>
