<template>
    <el-container class="home-container">
        <!-- 头部 -->
        <el-header>
            <div>
                <img src="../assets/logo.png" alt/>
                <span>后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <!-- 侧边 -->
            <el-aside :width="isCollapse ? 64+'px':200+'px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 菜单 -->
                <el-menu router unique-opened :collapseTransition="false" :collapse="isCollapse"
                         background-color="#333744"
                         text-color="#fff" active-text-color="#409eff">
                    <!-- 1级菜单 -->
                    <el-submenu v-for="item in menuList" :index="item.id+''" :key="item.id">
                        <template slot="title">
                            <i :class="icons[item.id]"></i>
                            <span>{{ item.authName }}</span>
                        </template>
                        <!-- 2级菜单 -->
                        <el-menu-item v-for="child in item.children" :index="child.path" :key="child.id">
                            <i class="el-icon-menu"></i>
                            <span>{{ child.authName }}</span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 主体 -->
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
    data() {
        return {
            menuList: [],
            icons: {
                125: 'el-icon-s-custom',
                103: 'el-icon-picture',
                101: 'el-icon-s-goods',
                102: 'el-icon-s-shop',
                145: 'el-icon-s-promotion'
            },
            isCollapse: false
        }
    },
    created() {
        this.getMenuList()
    },
    methods: {
        logout() {
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        getMenuList() {
            this.$http.get('menus').then(res => {
                this.menuList = res
            })
        },
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
        }
    }
}
</script>
<style lang="less" scoped>
.home-container {
    height: 100%;
}

.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;

    > div {
        display: flex;
        align-items: center;

        img {
            width: 60px;
            height: 60px;
        }

        span {
            margin-left: 15px;
        }
    }
}

.el-aside {
    background-color: #333744;

    .toggle-button {
        text-align: center;
        background-color: #4a5064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        letter-spacing: 0.2em;
        cursor: pointer;
    }

    .el-menu {
        border: 0;
    }
}

.el-main {
    background-color: #eaedf1;
}
</style>
