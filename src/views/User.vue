<template>
    <el-card>
        <!-- 头部区域 -->
        <el-row :gutter="20">
            <el-col :span="8">
                <el-input clearable @clear="getUserList" placeholder="请输入内容" v-model="queryParams.query">
                    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
            </el-col>
        </el-row>
        <!-- 表格区域 -->
        <el-table stripe border :data="userList" highlight-current-row>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="电话" prop="mobile"></el-table-column>
            <el-table-column label="角色" prop="role_name"></el-table-column>
            <el-table-column label="状态" prop="mg_state">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-tooltip content="修改用户" placement="top" :enterable="false">
                        <el-button size="mini" type="primary" @click="showEditDialog(scope.row.id)"
                                   icon="el-icon-edit"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除用户" placement="top" :enterable="false">
                        <el-button size="mini" type="danger" icon="el-icon-delete"
                                   @click="removeUser(scope.row.id)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="分配角色" placement="top" :enterable="false">
                        <el-button size="mini" type="warning" icon="el-icon-setting"
                                   @click="showSetRolesDialog(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="this.queryParams.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="this.queryParams.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.total">
        </el-pagination>
        <!-- 新增对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClose">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
                <el-form-item label="用户名称" prop="username">
                    <el-input v-model="addForm.username"/>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"/>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"/>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改对话框 -->
        <el-dialog
            title="修改用户"
            :visible.sync="updateDialogVisible"
            width="50%"
            @close="updateDialogClose">
            <el-form :model="updateForm" :rules="updateFormRules" ref="updateFormRef" label-width="80px">
                <el-form-item label="用户名称" prop="username">
                    <el-input v-model="updateForm.username" disabled/>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="updateForm.email"/>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="updateForm.mobile"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog
            title="分配角色"
            :visible.sync="setRolesDialogVisible"
            width="50%">
            <div>
                <p>{{ '当前用户：' + userInfo.username }}</p>
                <p>{{ '当前角色：' + userInfo.role_name }}</p>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="setRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRolesDialogVisible = false">确 定</el-button>
  </span>
        </el-dialog>
    </el-card>
</template>

<script>
import regConst from '@/const/regConst'
import userApi from '@/api/userApi'
import rolesApi from '@/api/rolesApi'

export default {
    name: 'User',
    data() {
        var checkEmail = (rule, value, cb) => {
            if (!regConst.emailReg.test(value)) {
                return cb(new Error('邮箱格式不正确'))
            }
            cb()
        }
        var checkMobile = (rule, value, cb) => {
            if (!regConst.mobileReg.test(value)) {
                return cb(new Error('手机格式不正确'))
            }
            cb()
        }
        return {
            userInfo: {},
            roleList: [],
            userList: [],
            queryParams: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            total: 0,
            addDialogVisible: false,
            updateDialogVisible: false,
            setRolesDialogVisible: false,
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            addFormRules: {
                username: [
                    {
                        required: true,
                        message: '请输入用户名称',
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 10,
                        message: '长度在 3 到 10 个字符',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 10,
                        message: '长度在 3 到 10 个字符',
                        trigger: 'blur'
                    }
                ],
                email: [
                    {
                        required: true,
                        message: '请输入邮箱',
                        trigger: 'blur'
                    },
                    {
                        validator: checkEmail,
                        trigger: 'blur'
                    }
                ],
                mobile: [
                    {
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    },
                    {
                        validator: checkMobile,
                        trigger: 'blur'
                    }
                ]
            },
            updateForm: {
                id: null,
                username: '',
                email: '',
                mobile: ''
            },
            updateFormRules: {
                email: [
                    {
                        required: true,
                        message: '请输入邮箱',
                        trigger: 'blur'
                    },
                    {
                        validator: checkEmail,
                        trigger: 'blur'
                    }
                ],
                mobile: [
                    {
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    },
                    {
                        validator: checkMobile,
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        getUserList() {
            userApi.userList(this.queryParams).then(res => {
                this.userList = res.users
                this.total = res.total
            })
        },
        handleSizeChange(newSize) {
            this.queryParams.pagesize = newSize
            this.getUserList()
        },
        handleCurrentChange(newNum) {
            this.queryParams.pagenum = newNum
            this.getUserList()
        },
        userStateChange(userInfo) {
            userApi.userStateChange(userInfo.id, userInfo.mg_state).then(res =>
                this.$message.success('状态修改成功')
            ).catch(error => {
                userInfo.mg_state = !userInfo.mg_state
                this.$message.error(error)
            })
        },
        addDialogClose() {
            this.$refs.addFormRef.resetFields()
        },
        updateDialogClose() {
            this.$refs.updateFormRef.resetFields()
        },
        addUser() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) {
                    return
                }
                userApi.addUser(this.addForm).then(res => {
                    this.$message.success('添加用户成功')
                    this.getUserList()
                })
                this.addDialogVisible = false
            })
        },
        showEditDialog(id) {
            userApi.getById(id).then(res => {
                this.updateDialogVisible = true
                this.updateForm = res
            })
        },
        updateUser() {
            this.$refs.updateFormRef.validate(async valid => {
                if (!valid) {
                    return
                }
                userApi.updateUser(this.updateForm).then(res => {
                    this.$message.success('修改用户成功')
                    this.getUserList()
                })
                this.updateDialogVisible = false
            })
        },
        removeUser(id) {
            this.$confirm('此操作将删除用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                userApi.deleteUser(id).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    this.getUserList()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        showSetRolesDialog(userInfo) {
            this.userInfo = userInfo
            rolesApi.rolesList().then(res => {
                this.roleList = res
            })
            this.setRolesDialogVisible = true
        }
    }
}
</script>

<style scoped>

</style>
