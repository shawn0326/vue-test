<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const workDirectoryStatus = ref({
  name: '',
  selected: false
})

const selectOptions = ref([])
const handles = []

const selectValue = ref('')

const imageUrl = ref('')

const pickWorkDirectory = async () => {
  const rootDirectory = await window.showDirectoryPicker()
  workDirectoryStatus.value.name = rootDirectory.name
  workDirectoryStatus.value.selected = true

  const assetsDirectory = await rootDirectory.getDirectoryHandle('assets', { create: true })

  for await (const [name, handle] of assetsDirectory.entries()) {
    selectOptions.value.push({
      value: name
    })
    handles.push(handle)
  }

  ElMessage({
    message: '选择工作文件夹成功',
    type: 'success'
  })
}

const onSelect = async (e) => {
  const index = selectOptions.value.findIndex((item) => item.value === e)
  if (index > -1) {
    const handle = handles[index]

    const file = await handle.getFile()
    const arrayBuffer = await file.arrayBuffer()
    const blob = new Blob([arrayBuffer], { type: file.type })
    imageUrl.value = URL.createObjectURL(blob)
  }
}

const onImageLoad = () => {
  URL.revokeObjectURL(imageUrl.value)
}
</script>

<template>
  <el-text>选择工作文件夹，在工作文件夹中创建assets目录，同步assets目录中的图片文件到选择列表</el-text>
  <br />
  <el-button type="primary" :disabled="workDirectoryStatus.selected" @click="pickWorkDirectory">
    选择工作文件夹
  </el-button>
  <el-text>{{ workDirectoryStatus.name }}</el-text>

  <el-divider />

  <el-text>选择 {{ workDirectoryStatus.name }}/assets 文件夹内的图片，则可以在下方显示图片资源</el-text>
  <br />
  <el-select v-model="selectValue" :disabled="!workDirectoryStatus.selected" placeholder="Select" @change="onSelect">
    <el-option v-for="item in selectOptions" :key="item.value" :label="`${item.value}`" :value="item.value" />
  </el-select>
  <br />
  <el-image style="width: 100px; height: 100px" v-bind:src="imageUrl" @load="onImageLoad" />

  <el-divider />

  <el-text>TODO： 将文件保存到 {{ workDirectoryStatus.name }}/output 文件夹中</el-text>
</template>
