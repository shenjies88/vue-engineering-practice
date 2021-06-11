<template>
    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary">添加分类</el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table stripe border :data="cateList" highlight-current-row>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="分类名称" prop="cat_name"></el-table-column>
            <el-table-column label="是否有效">
                <template slot-scope="scope">
                    <el-switch
                        v-model="!scope.row.cat_deleted"
                        disabled>
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="排序">
                <template slot-scope="scope">
                    <el-tag :type="getCateLevel(scope.row.cat_level)">{{ (scope.row.cat_level + 1) + '级' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-tooltip content="编辑" placement="top" :enterable="false">
                        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top" :enterable="false">
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="this.queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="this.queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.total">
        </el-pagination>
    </el-card>
</template>

<script>
import cateApi from '@/api/cateApi'

export default {
    name: 'Categories',
    data() {
        return {
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            cateList: [],
            total: 0
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        getCateList() {
            cateApi.list(this.queryInfo).then(res => {
                this.cateList = res.result
                this.total = res.total
            })
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        handleCurrentChange(newNum) {
            this.queryInfo.pagenum = newNum
            this.getCateList()
        },
        getCateLevel(level) {
            switch (level) {
                case 0:
                    return ''
                case 1:
                    return 'success'
                case 2:
                    return 'warning'
            }
        }
    },
}
</script>

<style scoped>

</style>
