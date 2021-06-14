<template>
    <el-card>
        <!-- 头部区域 -->
        <el-row>
            <el-col>
                <!-- 搜索输入框 -->
                <el-input clearable @clear="inputClear" @change="inputChange" v-model="queryParams.query"
                          placeholder="请输入内容"></el-input>
                <!-- 添加商品按钮 -->
                <el-button type="primary">添加商品</el-button>
            </el-col>
        </el-row>
        <!-- 商品表格数据 -->
        <el-table
            :data="goodList"
            stripe
            border
            highlight-current-row>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
                prop="goods_name"
                label="商品名称"
                width="600">
            </el-table-column>
            <el-table-column
                prop="goods_price"
                label="商品价格（元）">
            </el-table-column>
            <el-table-column
                prop="goods_weight"
                label="商品重量">
            </el-table-column>
            <el-table-column
                label="创建时间">
                <template slot-scope="scope">
                    {{ scope.row.add_time | timestampToTime }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-tooltip content="修改商品" placement="top" :enterable="false">
                        <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除商品" placement="top" :enterable="false">
                        <el-button size="mini" type="danger" icon="el-icon-delete"
                                   @click="deleteGood(scope.row.goods_id)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="this.queryParams.pagenum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="this.queryParams.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.total">
        </el-pagination>
    </el-card>
</template>

<script>
import goodApi from '@/api/goodApi'

export default {
    name: 'GoodList',
    created() {
        this.getGoodList()
    },
    data: function () {
        return {
            queryParams: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            total: 0,
            goodList: []
        }
    },
    methods: {
        getGoodList() {
            goodApi.list(this.queryParams).then(res => {
                this.total = res.total
                this.goodList = res.goods
            })
        },
        handleSizeChange(newSize) {
            this.queryParams.pagesize = newSize
            this.getGoodList()
        },
        handleCurrentChange(newNum) {
            this.queryParams.pagenum = newNum
            this.getGoodList()
        },
        inputChange() {
            if (this.queryParams.query) {
                this.getGoodList()
            }
        },
        inputClear() {
            this.queryParams.query = ''
            this.getGoodList()
        },
        deleteGood(id) {
            this.$confirm('此操作将永久删除商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                goodApi.delete(id).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    this.getGoodList()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        }
    }
}
</script>

<style lang="less" scoped>
.el-input {
    width: 300px;
    margin-right: 15px;
}
</style>
