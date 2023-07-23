<script setup lang="ts" name="machiningCates">
import { ref } from "vue"
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import { Machining } from '@/api/interface'
import { getCatesTree, delCate } from '@/api/modules/machining'
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface"
import { useHandleData } from "@/hooks/useHandleData"
import ProTable from "@/components/ProTable/index.vue"
import CateDrawer from './components/CateDrawer.vue'

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

// 表格配置项
const columns: ColumnProps<Machining.Cate>[] = [
  { type: "index", label: "#", width: 80 },
  { prop: "name", label: "分类名称" },
  { prop: "icon", label: "分类图标" },
  { prop: "updateTime", label: "更新时间", width: 180 },
  { prop: "createTime", label: "创建时间", width: 180 },
  { prop: "operation", label: "操作", width: 300, fixed: "right" }
];

const onFresh = () => {
  proTable.value?.getTableList()
}

const drawerRef = ref<InstanceType<typeof CateDrawer> | null>(null)
const openDrawer = (operation: string, cate?: Machining.Cate) => {
  drawerRef.value?.trigger(
    operation,
    onFresh,
    cate || null
  )
}

const del = async (id: string, name: string) => {
  await useHandleData(delCate, { id }, `删除 ${name} `)
  onFresh()
}
</script>

<template>
  <div class="main-box">
    <div class="table-box">
      <ProTable
        ref="proTable"
        title="用户列表"
        row-key="id"
        :indent="20"
        :columns="columns"
        :request-api="getCatesTree"
        :request-auto="true"
        :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" @click="openDrawer('save')" :icon="CirclePlus">新增分类</el-button>
        </template>
        <!-- 图标 -->
        <template #icon="{ row }">
          <el-image v-if="row.icon" :src="row.icon" style="height: 30px; width: 30px;"></el-image>
          <span v-else>-</span>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link @click="openDrawer('check', scope.row)" :icon="View"> 查看 </el-button>
          <el-button type="primary" link @click="openDrawer('edit', scope.row)" :icon="EditPen"> 编辑 </el-button>
          <el-button type="primary" link @click="del(scope.row.id, scope.row.name)" :icon="Delete"> 删除 </el-button>
        </template>
      </ProTable>
    </div>
    <CateDrawer ref="drawerRef" />
  </div>
</template>


