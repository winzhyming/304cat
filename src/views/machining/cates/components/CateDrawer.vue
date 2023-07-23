<script setup lang="ts" name="CateDrawer">
import { reactive, ref } from 'vue'
import { ElMessage, FormInstance } from "element-plus"
import { Machining } from '@/api/interface'
import { getCatesTree, saveCate, editCate } from '@/api/modules/machining'
import { tranformOptions, Option } from '@/api/helper/OptionsHandle'
import UploadImg from "@/components/Upload/Img.vue"

const rules = {
  name: [{ required: true, message: '请填写分类名称' }]
}

interface DrawerProps {
  id: string
  title: string
  operation: string
  isView: boolean
  onCallback: () => void
}

const form = reactive<Partial<Machining.Cate>>({
  name: '',
  icon: '',
  url: '',
  pid: '',
  createTime: '',
  updateTime: ''
})

const drawerProps = reactive<DrawerProps>({
  id: '',
  title: '',
  operation: '',
  isView: true,
  onCallback: () => {}
})
const visible = ref(false)

const loading = ref(true)
const catesTree = ref<Array<Option>>([])

const getCandidates = async () => {
  try {
    loading.value = true
    const { data } = await getCatesTree()
    catesTree.value = tranformOptions(data.list || [])
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const ruleFormRef = ref<FormInstance>();
const submitting = ref(false)
const onSubmit = async () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return
    try {
      submitting.value = true
      if ('save' === drawerProps.operation) {
        const { name, icon, url, pid } = form
        await saveCate({ name, icon, url, pid })
      } else if ('edit' === drawerProps.operation) {
        const { name, icon, url, pid } = form
        await editCate(drawerProps.id, { name, icon, url, pid }) 
      }
      ElMessage.success({ message: `${drawerProps.title} 成功！` })
      visible.value = false
      drawerProps.onCallback()
    } catch (err) {
      console.log(err)
    } finally {
      submitting.value = false
    }
  })
}

// 接收父组件传过来的参数
const trigger = (operation: string, callback: () => void, cate?: Machining.Cate | null) => {
  console.log('接收父组件传过来的参数')
  submitting.value = false
  if (operation === 'check') {
    const { name, url, icon, pid, updateTime, createTime } = cate as Machining.Cate
    drawerProps.title = `分类：${name}`
    Object.assign(form, { name, url, icon, pid, updateTime, createTime })
  } else if (operation === 'save') {
    drawerProps.title = '创建分类'
    Object.assign(form, { name: '', url: '', icon: '', pid: '' })
  } else if (operation === 'edit') {
    const { name, url, icon, id, pid } = cate as Machining.Cate
    drawerProps.id = id
    drawerProps.title = `编辑分类 ${name}:`
    Object.assign(form, { name, icon, url, pid })
  } else {
    ElMessage.warning({ message: '操作无权限' })
  }
  drawerProps.operation = operation
  drawerProps.isView = ('check' === operation)
  drawerProps.onCallback = callback
  visible.value = true
  getCandidates()
}

defineExpose({
  trigger
})
</script>

<template>
  <el-drawer v-model="visible" :destroy-on-close="true" size="450px" :title="drawerProps.title">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="form"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写分类" clearable></el-input>
      </el-form-item>
      <el-form-item label="分类图标" prop="icon">
        <UploadImg v-model:image-url="form.icon" width="135px" height="135px" :file-size="3">
          <template #empty>
            <el-icon><Avatar /></el-icon>
            <span>请上传图标</span>
          </template>
          <template #tip> 图标大小不能超过 3M </template>
        </UploadImg>
      </el-form-item>
      <el-form-item label="分类地址" prop="url">
        <el-input v-model="form.url" placeholder="请填写地址" clearable></el-input>
      </el-form-item>
      <el-form-item label="父分类" prop="pid">
        <el-tree-select
          :loading="loading"
          :data="catesTree"
          v-model="form.pid"
          clearable
        >
        </el-tree-select>
      </el-form-item>
      <el-form-item label="更新时间" prop="updateTime" v-if="drawerProps.isView">
        <el-input v-model="form.updateTime"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime" v-if="drawerProps.isView">
        <el-input v-model="form.updateTime"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false"> 取消 </el-button>
      <el-button v-show="!drawerProps.isView" :loading="submitting" type="primary" @click="onSubmit"> 确定 </el-button>
    </template>
  </el-drawer>
</template>