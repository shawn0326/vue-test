<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const workDirectoryStatus = ref({
  name: '',
  selected: false
})
let rootDirectory = null

const selectOptions = ref([])
const handles = []

const selectValue = ref('')

const imageUrl = ref('')

const pickWorkDirectory = async () => {
  rootDirectory = await window.showDirectoryPicker()
  workDirectoryStatus.value.name = rootDirectory.name
  workDirectoryStatus.value.selected = true

  await _syncAssets()

  ElMessage({
    message: '选择工作文件夹成功',
    type: 'success'
  })
}

const _syncAssets = async () => {
  const assetsDirectory = await rootDirectory.getDirectoryHandle('assets', { create: true })

  selectOptions.value.length = 0
  handles.length = 0
  for await (const [name, handle] of assetsDirectory.entries()) {
    selectOptions.value.push({
      value: name
    })
    handles.push(handle)
  }
}

const syncAssets = async () => {
  await _syncAssets()

  ElMessage({
    message: '同步成功',
    type: 'success'
  })
}

const getHandleByValue = (value) => {
  const index = selectOptions.value.findIndex((item) => item.value === value)
  if (index > -1) {
    return handles[index]
  }
  return null
}

const onSelect = async (e) => {
  const handle = getHandleByValue(e)
  if (handle) {
    const file = await handle.getFile()
    const arrayBuffer = await file.arrayBuffer()
    const blob = new Blob([arrayBuffer], { type: file.type })
    imageUrl.value = URL.createObjectURL(blob)
  }
}

const onImageLoad = () => {
  URL.revokeObjectURL(imageUrl.value)
}

const savingName = ref('unname')
const savingStatus = ref(false)

const saveFiles = async () => {
  savingStatus.value = true

  const sourceImageHandle = getHandleByValue(selectValue.value)

  const outputDirectory = await rootDirectory.getDirectoryHandle('output', { create: true })

  const nameDirectory = await outputDirectory.getDirectoryHandle(savingName.value, { create: true })

  const json = { version: '1.0.0', image: '', list: [] }
  const defaultImageName = 'image.png'

  if (sourceImageHandle) {
    json.image = defaultImageName
  }

  const file = await nameDirectory.getFileHandle('index.json', { create: true })
  const writable = await file.createWritable()
  await writable.write(JSON.stringify(json))
  await writable.close()

  if (sourceImageHandle) {
    const imageFile = await nameDirectory.getFileHandle(defaultImageName, { create: true })
    const imageWritable = await imageFile.createWritable()
    await imageWritable.write(await (await sourceImageHandle.getFile()).arrayBuffer())
    await imageWritable.close()
  }

  ElMessage({
    message: '文件保存成功',
    type: 'success'
  })

  savingStatus.value = false
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
  <el-button type="primary" :disabled="!workDirectoryStatus.selected" @click="syncAssets"> 同步 </el-button>
  <br />
  <el-image style="width: 100px; height: 100px" v-bind:src="imageUrl" @load="onImageLoad" />

  <el-divider />

  <el-text>将文件保存到 {{ workDirectoryStatus.name }}/output/</el-text>
  <el-input v-model="savingName" placeholder="folder name" style="width: 200px" />
  <el-text> 文件夹中</el-text>
  <br />
  <el-button type="primary" :disabled="!workDirectoryStatus.selected || savingStatus" @click="saveFiles">
    {{ savingStatus ? '保存中' : '保存文件' }}
  </el-button>
</template>
