<template>
    <el-card>
        <!-- 头部区域 -->
        <el-row>
            <el-col>
                <el-input clearable style="width: 300px;" placeholder="请输入内容" v-model="queryParams.query">
                    <el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <!-- 表格区域 -->
        <el-table
            :data="orderList"
            stripe
            border
            highlight-current-row>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
                prop="order_number"
                label="订单编号"
                width="500">
            </el-table-column>
            <el-table-column
                prop="order_price"
                label="订单价格">
            </el-table-column>
            <el-table-column
                label="是否付款">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.order_pay === '0'" type="danger">未付款</el-tag>
                    <el-tag v-else type="success">已付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="is_send"
                label="是否发货">
            </el-table-column>
            <el-table-column
                label="下单时间">
                <template slot-scope="scope">
                    {{ scope.row.create_time | timestampToTime }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="360">
                <template slot-scope="scope">
                    <el-tooltip content="修改地址" placement="top" :enterable="false">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialogVisible">修改地址
                        </el-button>
                    </el-tooltip>
                    <el-tooltip content="物流进度" placement="top" :enterable="false">
                        <el-button size="mini" type="success" icon="el-icon-location"
                                   @click="showProgressDialogVisible">物流进度
                        </el-button>
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
        <!-- 修改地址对话框 -->
        <el-dialog
            title="修改地址"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClose">
            <el-form :model="editForm" :rules="editFormRule" ref="editFormRef" label-width="100px">
                <el-form-item label="省市区" prop="province">
                    <el-cascader
                        style="width: 100%;"
                        v-model="selectProvince"
                        :options="provinces"
                        :props="cascaderProps"
                        clearable></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address">
                    <el-input v-model="editForm.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 物流进度对话框 -->
        <el-dialog
            title="物流进度"
            :visible.sync="progressDialogVisible"
            width="50%">
            <el-timeline>
                <el-timeline-item
                    v-for="(activity, index) in activities"
                    :key="index"
                    :timestamp="activity.time">
                    {{ activity.context }}
                </el-timeline-item>
            </el-timeline>
            <span slot="footer" class="dialog-footer">
                <el-button @click="progressDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="progressDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
</template>

<script>
import orderApi from '@/api/orderApi'
import provinces from '@/js/provinces'

export default {
    name: 'Orders',
    created() {
        this.getOrderList()
    },
    data: function () {
        return {
            total: 0,
            orderList: [],
            queryParams: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            editDialogVisible: false,
            editForm: {
                address: ''
            },
            editFormRule: {
                address: [
                    {
                        required: true,
                        message: '请输入详细地址',
                        trigger: 'blur'
                    }
                ],
                province: [
                    {
                        required: true,
                        message: '请选择省市区',
                        trigger: 'blur'
                    }
                ]
            },
            selectProvince: [],
            cascaderProps: {
                value: 'value',
                label: 'label',
                children: 'children',
                expandTrigger: 'hover'
            },
            progressDialogVisible: false,
            activities: []
        }
    },
    computed: {
        provinces: function () {
            return provinces
        }
    },
    methods: {
        handleSizeChange(newSize) {
            this.queryParams.pagesize = newSize
            this.getOrderList()
        },
        handleCurrentChange(newNum) {
            this.queryParams.pagenum = newNum
            this.getOrderList()
        },
        getOrderList() {
            orderApi.list(this.queryParams).then(res => {
                this.total = res.total
                this.orderList = res.goods
            })
        },
        searchOrder() {
            this.getOrderList()
        },
        showEditDialogVisible() {
            this.editDialogVisible = true
        },
        editDialogClose() {
            this.selectProvince = []
            this.$refs.editFormRef.resetFields()
        },
        showProgressDialogVisible() {
            this.progressDialogVisible = true
            orderApi.kuaidi().then(res => {
                this.activities = res
            })
        }
    }
}
</script>

<style lang="less" scoped>

</style>
