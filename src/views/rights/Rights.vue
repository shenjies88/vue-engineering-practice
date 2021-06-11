<template>
    <el-card>
        <!-- 表格区域 -->
        <el-table stripe border :data="rightList" highlight-current-row
                  :default-sort=defaultSort>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="权限等级" prop="level" sortable>
                <template slot-scope="scope">
                    <el-tag :type="getLevelType(scope.row.level)">{{ (Number(scope.row.level) + 1) + '级' }}</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
import rightsApi from '@/api/rightsApi'

export default {
    name: 'Rights',
    data() {
        return {
            rightList: [],
            defaultSort: {
                prop: 'level',
                order: 'ascending'
            }
        }
    },
    created() {
        this.getRightList()
    },
    methods: {
        getRightList() {
            rightsApi.rightList('list').then(res => {
                this.rightList = res
            })
        },
        getLevelType(level) {
            switch (level) {
                case '1':
                    return 'success'
                case '2':
                    return 'warning'
                default:
                    return ''
            }
        }
    }
}
</script>

<style scoped>

</style>
