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
                            <el-tag>{{ item1.authName }}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 2、3级权限 -->
                        <el-col :span="18">
                            <el-row :class="[i2 === 0 ? '' : 'dbtop','vcenter']" v-for="(item2,i2) in item1.children"
                                    :key="item2.id">
                                <!-- 2级权限 -->
                                <el-col :span="6">
                                    <el-tag type="success ">{{ item2.authName }}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <!-- 3级权限 -->
                                <el-col :span="18">
                                    <el-tag type="warning" v-for="(item3,i3) in item2.children"
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
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-tooltip content="编辑角色" placement="top" :enterable="false">
                        <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除角色" placement="top" :enterable="false">
                        <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
                    </el-tooltip>
                    <el-tooltip content="分配权限" placement="top" :enterable="false">
                        <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
import rolesApi from '@/api/rolesApi'

export default {
    name: 'Roles',
    data() {
        return {
            rolesList: []
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
