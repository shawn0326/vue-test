<script setup>
import { ref } from 'vue'

const fileStatus = ref({
  name: '',
  selected: false
})

const selectFile = async () => {
  const rootDirectory = await window.showDirectoryPicker();
  if (rootDirectory.kind == 'directory') {
    fileStatus.value.name = rootDirectory.name
    fileStatus.value.selected = true

    const assetsDirectory = await rootDirectory.getDirectoryHandle('assets', { create: true });

    for await (const [name, handle] of assetsDirectory.entries()) {
      selectOptions.value.push({
        value: name
      })
      handles.push(handle)
    }
  } else {
    console.log('not a directory')
  }
}

const selectValue = ref('')

const selectOptions = ref([])
const handles = [];

const onSelect = async (e) => {
  console.log(e)
  const index = selectOptions.value.findIndex(item => item.value === e);
  if (index > -1) {
    const handle = handles[index];

    const file = await handle.getFile();
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });
    imageUrl.value = URL.createObjectURL(blob);
  }
}

const onImageLoad = () => {
  URL.revokeObjectURL(imageUrl.value);
}

const imageUrl = ref('')
</script>

<template>
  <el-text>选择工作文件夹，在工作文件夹中创建assets目录，同步assets目录中的图片文件到选择列表</el-text>
  <br />
  <el-button type="primary" :disabled="fileStatus.selected" @click="selectFile">
    选择工作文件夹
  </el-button>
  <el-text>{{ fileStatus.name }}</el-text>

  <el-divider />

  <el-text>选择assets文件夹内的图片，则可以在下方显示图片资源</el-text>
  <br />
  <el-select v-model="selectValue" :disabled="!fileStatus.selected" placeholder="Select" @change="onSelect">
    <el-option
      v-for="item in selectOptions"
      :key="item.value"
      :label="`${item.value}`"
      :value="item.value"
    />
  </el-select>
  <br />
  <el-image style="width: 100px; height: 100px" :src="imageUrl" @load="onImageLoad" />
</template>
