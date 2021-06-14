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
                <el-button :disabled="isBtnDisabled" size="mini" type="primary" @click="showAddDiaLog">添加参数</el-button>
                <!-- 动态参数表格 -->
                <el-table border stripe :data="manyTableData">
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <!-- 循环渲染 -->
                            <el-tag closable style="margin-right: 15px" v-for="(item,i) in scope.row.attr_vals"
                                    :key="i" @close="closeManyTag(i,scope.row)">
                                {{ item }}
                            </el-tag>
                            <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"></el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New
                                Tag
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-tooltip content="修改" placement="top" :enterable="false">
                                <el-button size="mini" type="primary" icon="el-icon-edit"
                                           @click="showEditDiaLog(scope.row)">修改
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="top" :enterable="false">
                                <el-button size="mini" type="danger" icon="el-icon-delete"
                                           @click="deleteParams(scope.row.attr_id)">删除
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <!-- 静态属性面板 -->
            <el-tab-pane label="静态属性" name="only">
                <el-button :disabled="isBtnDisabled" size="mini" type="primary" @click="showAddDiaLog">添加属性</el-button>
                <!-- 静态属性表格 -->
                <el-table border stripe :data="onlyTableData">
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <el-tag style="margin-right: 15px" v-for="(item,i) in scope.row.attr_vals"
                                    :key="i">
                                {{ item }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-tooltip content="修改" placement="top" :enterable="false">
                                <el-button size="mini" type="primary" icon="el-icon-edit"
                                           @click="showEditDiaLog(scope.row)">修改
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="top" :enterable="false">
                                <el-button size="mini" type="danger" icon="el-icon-delete"
                                           @click="deleteParams(scope.row.attr_id)">删除
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <!-- 添加动态参数或静态属性对话框 -->
        <el-dialog
            :title="'添加'+title"
            :visible.sync="addDiaLogVisible"
            width="50%"
            @close="closeAddDiaLog">
            <el-form :model="addParamsForm" :rules="addParamsFormRules" ref="addParamsFormRef" label-width="100px">
                <el-form-item :label="inputName" prop="attr_name">
                    <el-input v-model="addParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDiaLogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑动态参数或静态属性对话框 -->
        <el-dialog
            :title="'编辑'+title"
            :visible.sync="editDiaLogVisible"
            width="50%"
            @close="closeEditDiaLog">
            <el-form :model="editParamsForm" :rules="editParamsFormRules" ref="editParamsFormRef" label-width="100px">
                <el-form-item :label="inputName" prop="attr_name">
                    <el-input v-model="editParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDiaLogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
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
            return this.tabActiveName === 'many' ? '动态参数' : '静态属性'
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
            addDiaLogVisible: false,
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
            },
            editDiaLogVisible: false,
            editParamsForm: {
                attr_name: '',
                attrId: null
            },
            editParamsFormRules: {
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
                this.selectCateList = []
                return
            }
            paramsApi.list(this.selectCateId, this.tabActiveName).then(res => {
                res.forEach(item => {
                    item.attr_vals = item.attr_vals ?
                        item.attr_vals.split(',') : []
                    item.inputVisible = false
                    item.inputValue = ''
                })
                if (this.tabActiveName === 'many') {
                    this.manyTableData = res
                } else {
                    this.onlyTableData = res
                }
            })
        },
        showAddDiaLog() {
            this.addDiaLogVisible = true
        },
        closeAddDiaLog() {
            this.$refs.addParamsFormRef.resetFields()
        },
        addParams() {
            this.$refs.addParamsFormRef.validate(valid => {
                if (!valid) {
                    return
                }
                paramsApi.add(this.selectCateId, this.addParamsForm.attr_name, this.tabActiveName).then(res => {
                    this.changeData()
                    this.$message.success('添加成功')
                })
                this.addDiaLogVisible = false
            })
        },
        closeEditDiaLog() {
            this.$refs.editParamsFormRef.resetFields()
            this.editParamsForm.attrId = null
        },
        editParams() {
            this.$refs.editParamsFormRef.validate(valid => {
                if (!valid) {
                    return
                }
                paramsApi.update(this.selectCateId, this.editParamsForm.attrId, this.editParamsForm.attr_name, this.tabActiveName).then(res => {
                    this.changeData()
                    this.$message.success('编辑成功')
                })
                this.editDiaLogVisible = false
            })
        },
        showEditDiaLog(row) {
            this.editParamsForm.attr_name = row.attr_name
            this.editParamsForm.attrId = row.attr_id
            this.editDiaLogVisible = true
        },
        deleteParams(attrId) {
            this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                paramsApi.delete(this.selectCateId, attrId).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    this.changeData()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        handleInputConfirm(row) {
            if (row.inputValue.trim().length === 0) {
                row.inputValue = ''
                row.inputVisible = false
                return
            }
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible = false
            paramsApi.update(this.selectCateId, row.attr_id, row.attr_name, row.attr_sel, row.attr_vals.join(',')).then(res => {
                this.$message.success('添加属性成功')
            })
        },
        showInput(row) {
            row.inputVisible = true
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        closeManyTag(index, row) {
            row.attr_vals.splice(index, 1)
            paramsApi.update(this.selectCateId, row.attr_id, row.attr_name, row.attr_sel, row.attr_vals.join(',')).then(_ => {
                this.$message.success('删除成功')
            })
        }
    }
}
</script>

<style lang="less" scoped>
.cat_op {
    margin-top: 15px;
}

.input-new-tag {
    width: 150px;
}
</style>
