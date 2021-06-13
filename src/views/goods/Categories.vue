<template>
    <el-card>
        <!-- 头部 -->
        <el-row>
            <el-col>
                <el-button type="primary" @click="showAddCateDaiLog">添加分类</el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table border :data="cateList" row-key="cat_id" :tree-props=treeProps>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="分类名称" prop="cat_name"></el-table-column>
            <el-table-column label="是否有效">
                <template slot-scope="scope">
                    <i style="color: green" v-if="!scope.row.cat_deleted" class="el-icon-success"></i>
                    <i style="color: red" v-else class="el-icon-error"></i>
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
                        <el-button size="mini" type="primary" icon="el-icon-edit"
                                   @click="showUpdateCateDiaLog(scope.row)">编辑
                        </el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top" :enterable="false">
                        <el-button size="mini" type="danger" icon="el-icon-delete"
                                   @click="deleteCate(scope.row.cat_id)">删除
                        </el-button>
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
        <!-- 添加分类的对话框 -->
        <el-dialog
            title="添加分类"
            :visible.sync="addCateVisible"
            width="50%"
            @close="closeAddCateDiaLog">
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称:" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类:">
                    <el-cascader
                        v-model="selectCateList"
                        :options="parentCateList"
                        :props="cascaderProps"
                        clearable
                        @change="cascaderChange">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <template #footer>
    <span class="dialog-footer">
      <el-button @click="addCateVisible = false">取 消</el-button>
      <el-button type="primary" @click="addCate">确 定</el-button>
    </span>
            </template>
        </el-dialog>
        <!-- 编辑分类对话框 -->
        <el-dialog
            title="编辑分类"
            :visible.sync="updateCateDiaLogVisible"
            width="50%"
            @close="closeUpdateCateDiaLog">
            <el-form :model="updateCateForm" :rules="updateCateFormRules" ref="updateCateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="updateCateForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="updateCateDiaLogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateCate">确 定</el-button>
  </span>
        </el-dialog>
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
            parentCateQueryInfo: {
                type: 2
            },
            cateList: [],
            total: 0,
            treeProps: {
                children: 'children'
            },
            addCateVisible: false,
            addCateForm: {
                cat_name: '',
                cat_pid: 0,
                cat_level: 0
            },
            addCateFormRules: {
                cat_name: [
                    {
                        required: true,
                        message: '请输入分类名称',
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 10,
                        message: '长度在 3 到 10 个字符',
                        trigger: 'blur'
                    }
                ]
            },
            parentCateList: [],
            selectCateList: [],
            cascaderProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                checkStrictly: true,
                expandTrigger: 'hover'
            },
            updateCateDiaLogVisible: false,
            updateCateForm: {
                cat_name: '',
                id: null
            },
            updateCateFormRules: {
                cat_name: [
                    {
                        required: true,
                        message: '请输入分类名称',
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 10,
                        message: '长度在 3 到 10 个字符',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        showAddCateDaiLog() {
            this.addCateVisible = true
            this.getParentCateList()
        },
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
        },
        closeAddCateDiaLog() {
            this.$refs.addCateFormRef.resetFields()
            this.selectCateList = []
            this.addCateForm.cat_pid = 0
            this.addCateForm.cat_level = 0
        },
        getParentCateList() {
            cateApi.list(this.parentCateQueryInfo).then(res => {
                this.parentCateList = res
            })
        },
        cascaderChange() {
            if (this.selectCateList.length > 0) {
                this.addCateForm.cat_pid = this.selectCateList[this.selectCateList.length - 1]
                this.addCateForm.cat_level = this.selectCateList.length
            } else {
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        },
        addCate() {
            this.$refs.addCateFormRef.validate(valid => {
                if (!valid) {
                    return
                }
                cateApi.add(this.addCateForm).then(() => {
                    this.$message.success('添加分类成功')
                    this.getCateList()
                })
                this.addCateVisible = false
            })
        },
        showUpdateCateDiaLog(row) {
            this.updateCateDiaLogVisible = true
            this.updateCateForm.cat_name = row.cat_name
            this.updateCateForm.id = row.cat_id
        },
        closeUpdateCateDiaLog() {
            this.$refs.updateCateFormRef.resetFields()
            this.updateCateForm.id = null
        },
        updateCate() {
            this.$refs.updateCateFormRef.validate(valid => {
                if (!valid) {
                    return
                }
                cateApi.update(this.updateCateForm.id, this.updateCateForm.cat_name).then(() => {
                    this.$message.success('修改分类成功')
                    this.getCateList()
                })
                this.updateCateDiaLogVisible = false
            })
        },
        deleteCate(id) {
            this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                cateApi.delete(id).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    this.getCateList()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        }
    },
}
</script>

<style lang="less" scoped>
.el-cascader {
    width: 100%;
}
</style>
