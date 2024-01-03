<script setup>
import { ref } from 'vue'

const fileStatus = ref({
  name: '',
  selected: false
})

const selectFile = () => {
  window.showDirectoryPicker().then((event) => {
    if (event.kind == 'directory') {
      fileStatus.value.name = event.name
      fileStatus.value.selected = true
    } else {
      console.log('not a directory')
    }
  })
}
</script>

<template>
  <el-button type="primary" :disabled="fileStatus.selected" @click="selectFile">
    选择工作文件夹
  </el-button>
  <el-text>{{ fileStatus.name }}</el-text>
</template>
