<template>
    <el-card>
        <!-- 警告区域 -->
        <el-alert
            title="注意：只可选择三级分类"
            type="warning"
            :closable="false"
            show-icon>
        </el-alert>
        <!-- 集联选择器区域 -->
        <el-row class="cat_op">
            <el-col>
                <span>选择商品分类：</span>
                <el-cascader
                    v-model="selectCateList"
                    :options="parentCateList"
                    :props="cascaderProps"
                    clearable
                    @change="handleCascaderChange">
                </el-cascader>
            </el-col>
        </el-row>
        <!-- Tab页签区域 -->
        <el-tabs v-model="tabActiveName" @tab-click="handleTableClick">
            <!-- 动态参数面板 -->
            <el-tab-pane label="动态参数" name="many">
                <el-button :disabled="isBtnDisabled" size="mini" type="primary" @click="showDiaLog">添加参数</el-button>
                <!-- 动态参数表格 -->
                <el-table border stripe :data="manyTableData">
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <el-tag style="margin-right: 15px" v-for="item in scope.row.attr_vals.split(',')">
                                {{ item }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-tooltip content="修改" placement="top" :enterable="false">
                                <el-button size="mini" type="primary" icon="el-icon-edit">修改
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="top" :enterable="false">
                                <el-button size="mini" type="danger" icon="el-icon-delete">删除
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <!-- 静态属性面板 -->
            <el-tab-pane label="静态属性" name="only">
                <el-button :disabled="isBtnDisabled" size="mini" type="primary" @click="showDiaLog">添加属性</el-button>
                <!-- 静态属性表格 -->
                <el-table border stripe :data="onlyTableData">
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <el-tag style="margin-right: 15px" v-for="item in scope.row.attr_vals.split(',')">
                                {{ item }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-tooltip content="修改" placement="top" :enterable="false">
                                <el-button size="mini" type="primary" icon="el-icon-edit">修改
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="top" :enterable="false">
                                <el-button size="mini" type="danger" icon="el-icon-delete">删除
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <!-- 添加动态参数或静态属性表格 -->
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="50%"
            @close="closeDiaLog">
            <el-form :model="addParamsForm" :rules="addParamsFormRules" ref="addParamsFormRef" label-width="100px">
                <el-form-item :label="inputName" prop="attr_name">
                    <el-input v-model="addParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
        </el-dialog>
    </el-card>
</template>

<script>
import cateApi from '@/api/cateApi'
import paramsApi from '@/api/paramsApi'

export default {
    name: 'Params',
    created() {
        this.getParentCateList()
    },
    computed: {
        isBtnDisabled() {
            return !(this.selectCateList.length > 0)
        },
        selectCateId() {
            return this.selectCateList[2]
        },
        title() {
            return this.tabActiveName === 'many' ? '添加动态参数' : '添加静态属性'
        },
        inputName() {
            return this.tabActiveName === 'many' ? '动态属性' : '静态属性'
        }
    },
    data: function () {
        return {
            selectCateList: [],
            parentCateList: [],
            cascaderProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                expandTrigger: 'hover'
            },
            parentCateQueryInfo: {
                type: 3
            },
            tabActiveName: 'many',
            manyTableData: [],
            onlyTableData: [],
            dialogVisible: false,
            addParamsForm: {
                attr_name: ''
            },
            addParamsFormRules: {
                attr_name: [
                    {
                        required: true,
                        message: '请输入属性或参数名称',
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 10,
                        message: '长度在 3 到 10 个字符',
                        trigger: 'blur'
                    }
                ],
            }
        }
    },
    methods: {
        getParentCateList() {
            cateApi.list(this.parentCateQueryInfo).then(res => {
                this.parentCateList = res
            })
        },
        handleCascaderChange() {
            this.changeData()
        },
        handleTableClick() {
            this.changeData()
        },
        changeData() {
            const id = this.selectCateId
            if (!id) {
                this.manyTableData = []
                this.onlyTableData = []
                return
            }
            paramsApi.list(this.selectCateId, this.tabActiveName).then(res => {
                if (this.tabActiveName === 'many') {
                    this.manyTableData = res
                } else {
                    this.onlyTableData = res
                }
            })
        },
        showDiaLog() {
            this.dialogVisible = true
        },
        closeDiaLog() {
            this.$refs.addParamsFormRef.resetFields()
        },
        addParams() {
            paramsApi.add(this.selectCateId, this.addParamsForm.attr_name, this.tabActiveName).then(res => {
                this.changeData()
                this.$message.success('添加成功')
            })
            this.dialogVisible = false
        }
    }
}
</script>

<style lang="less" scoped>
.cat_op {
    margin-top: 15px;
}
</style>
