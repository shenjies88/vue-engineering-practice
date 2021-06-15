<template>
    <el-card>
        <!-- 警告提示区域 -->
        <el-alert
            title="添加商品信息"
            type="info"
            center
            show-icon
            :closable="false">
        </el-alert>
        <!-- 步骤区域 -->
        <el-steps align-center :active="activeIndex-0" finish-status="success">
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>
        <!-- Tabs区域 -->
        <el-form label-position="top" :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
            <el-tabs @tab-click="tabClick" :before-leave="beforeLeave" v-model="activeIndex" tab-position="left">
                <el-tab-pane label="基本信息" name="0">
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input v-model="addForm.goods_name"/>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                        <el-input v-model="addForm.goods_price" type="number"/>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                        <el-input v-model="addForm.goods_weight" type="number"/>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                        <el-input v-model="addForm.goods_number" type="number"/>
                    </el-form-item>
                    <el-form-item label="商品分类（仅可选择三级分类）" prop="selectCateList">
                        <el-cascader
                            v-model="addForm.selectCateList"
                            :options="cateList"
                            :props="cascaderProps"
                            clearable
                            @change="cascaderChange">
                        </el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                    <el-form-item :label="item.attr_name" v-for="item in paramsManyDataList" :key="item.attr_id">
                        <el-checkbox-group v-model="item.attr_vals">
                            <el-checkbox :key="i" v-for="(attr,i) in item.attr_vals" :label="attr"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
                <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
                <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
            </el-tabs>
        </el-form>
    </el-card>
</template>

<script>
import cateApi from '@/api/cateApi'
import paramsApi from '@/api/paramsApi'

export default {
    name: 'AddGood',
    created() {
        this.getCateList()
    },
    computed: {
        selectCateId: function () {
            return this.addForm.selectCateList[2]
        }
    },
    data: function () {
        return {
            //商品参数
            paramsManyDataList: [],
            //商品分类列表
            cateList: [],
            cascaderProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                checkStrictly: false,
                expandTrigger: 'hover'
            },
            activeIndex: '0',
            addForm: {
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                //已选择的商品分类id列表
                selectCateList: []
            },
            addFormRules: {
                goods_name: [
                    {
                        required: true,
                        message: '请输入商品名称',
                        trigger: 'blur'
                    }
                ],
                goods_price: [
                    {
                        required: true,
                        message: '请输入商品价格',
                        trigger: 'blur'
                    }
                ],
                goods_weight: [
                    {
                        required: true,
                        message: '请输入商品重量',
                        trigger: 'blur'
                    }
                ],
                goods_number: [
                    {
                        required: true,
                        message: '请输入商品数量',
                        trigger: 'blur'
                    }
                ],
                selectCateList: [
                    {
                        required: true,
                        message: '请选择商品分类',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    methods: {
        getCateList() {
            cateApi.list().then(res => {
                this.cateList = res
            })
        },
        cascaderChange() {
            if (this.addForm.selectCateList.length !== 3) {
                this.addForm.selectCateList = []
            }
        },
        beforeLeave(activeName, oldActiveName) {
            if (oldActiveName === '0' && this.addForm.selectCateList.length !== 3) {
                this.$message.error('请选择商品分类')
                return false
            }
        },
        tabClick() {
            if (this.activeIndex === '1') {
                paramsApi.list(this.selectCateId, 'many').then(res => {
                    res.forEach(item => {
                        item.attr_vals = item.attr_vals.length === 0 ? [] :
                            item.attr_vals.split(',')
                    })
                    this.paramsManyDataList = res
                })
            }
        }
    }
}
</script>

<style lang="less" scoped>

</style>
