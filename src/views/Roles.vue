<template>
    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary">添加角色</el-button>
            </el-col>
        </el-row>
        <!-- 表格区域 -->
        <el-table stripe border :data="rolesList" highlight-current-row>
            <!-- 权限区域 -->
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row :class="['dbbottom' , i1===0?'dbtop':'dbbottom','vcenter']"
                            v-for="(item1,i1) in scope.row.children"
                            :key="item1.id">
                        <!-- 1级权限 -->
                        <el-col :span="6">
                            <el-tag @close="removeRightsById(scope.row,item1.id)" closable>{{ item1.authName }}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 2、3级权限 -->
                        <el-col :span="18">
                            <el-row :class="[i2 === 0 ? '' : 'dbtop','vcenter']" v-for="(item2,i2) in item1.children"
                                    :key="item2.id">
                                <!-- 2级权限 -->
                                <el-col :span="6">
                                    <el-tag @close="removeRightsById(scope.row,item2.id)" closable type="success ">
                                        {{ item2.authName }}
                                    </el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <!-- 3级权限 -->
                                <el-col :span="18">
                                    <el-tag @close="removeRightsById(scope.row,item3.id)" closable type="warning"
                                            v-for="(item3,i3) in item2.children"
                                            :key="item3.id">{{ item3.authName }}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                    <el-tooltip content="编辑角色" placement="top" :enterable="false">
                        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                    </el-tooltip>
                    <el-tooltip content="删除角色" placement="top" :enterable="false">
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                    </el-tooltip>
                    <el-tooltip content="分配权限" placement="top" :enterable="false">
                        <el-button @click="showSetRightDialog(scope.row)" size="mini" type="warning"
                                   icon="el-icon-setting">分配权限
                        </el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分配权限对话框 -->
        <el-dialog
            title="提示"
            :visible.sync="setRightDialog"
            width="50%"
            @close="closeSetRightDialog">
            <!-- 树形权限 -->
            <el-tree ref="treeRef" node-key="id" :default-checked-keys="defaultKeys" show-checkbox default-expand-all
                     :data="rightList" :props="rightListProps"></el-tree>
            <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialog = false">取 消</el-button>
    <el-button type="primary" @click="allowRight">确 定</el-button>
  </span>
        </el-dialog>
    </el-card>
</template>

<script>
import rolesApi from '@/api/rolesApi'
import rightsApi from '@/api/rightsApi'

export default {
    name: 'Roles',
    data() {
        return {
            rolesList: [],
            setRightDialog: false,
            rightList: [],
            rightListProps: {
                children: 'children',
                label: 'authName'
            },
            defaultKeys: [],
            roleId: null
        }
    },
    created() {
        this.getRolesList()
    },
    methods: {
        getRolesList() {
            rolesApi.rolesList().then(res => {
                this.rolesList = res
            })
        },
        removeRightsById(roles, rightsId) {
            this.$confirm('此操作将删除权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                rolesApi.deleteRight(roles.id, rightsId).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    roles.children = res
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        showSetRightDialog(row) {
            this.setRightDialog = true
            this.roleId = row.id
            rightsApi.rightList('tree').then(res => {
                this.rightList = res
                this.getLeaftKeys(row, this.defaultKeys)
            })
        },
        getLeaftKeys(node, arr) {
            if (!node.children) {
                return arr.push(node.id)
            }
            node.children.forEach(item => {
                return this.getLeaftKeys(item, arr)
            })
        },
        closeSetRightDialog() {
            this.defaultKeys = []
        },
        allowRight() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            const idStr = keys.join(',')
            rolesApi.roleAuthorization(this.roleId, idStr).then(() => {
                this.$message.success('授权成功')
                this.getRolesList()
            })
            this.setRightDialog = false
        }
    }
}
</script>

<style scoped>
.el-tag {
    margin: 7px;
}

.dbtop {
    border-top: 1px solid #eee;
}

.dbbottom {
    border-bottom: 1px solid #eee;
}

.vcenter {
    display: flex;
    align-items: center;
}
</style>
