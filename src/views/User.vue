<template>
    <el-card>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-input placeholder="请输入内容">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary">添加用户</el-button>
            </el-col>
        </el-row>
        <el-table stripe border :data="userList" highlight-current-row>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="电话" prop="mobile"></el-table-column>
            <el-table-column label="角色" prop="role_name"></el-table-column>
            <el-table-column label="状态" prop="mg_state">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <el-tooltip content="修改用户" placement="top">
                    <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
                </el-tooltip>
                <template>
                    <el-tooltip content="删除用户" placement="top">
                        <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
                    </el-tooltip>
                    <el-tooltip content="分配角色" placement="top">
                        <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
export default {
    name: 'User',
    data() {
        return {
            userList: [],
            queryParams: {
                pagenum: 1,
                pagesize: 10
            },
            total: 0
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        getUserList() {
            this.$http.get('/users', {
                params: this.queryParams
            }).then(res => {
                this.userList = res.users
                this.total = res.total
            })
        }
    }
}
</script>

<style scoped>

</style>
