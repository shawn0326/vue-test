<script setup>
import { ref } from 'vue'

const message = ref({
  text: 'Hello World!',
  colors: ['#409EFF', null]
})

const removeColor = (index) => {
  message.value.colors.splice(index, 1)
  console.log(message)
}
const addColor = () => {
  message.value.colors.push(null)
  console.log(message)
}

const treeData = ref({
  selected: 1,
  list: [
    {
      id: 1,
      label: 'Level 1',
      children: [
        {
          id: 2,
          label: 'Level 2',
          hh: true,
          children: [
            {
              id: 3,
              label: 'Level 3',
              disabled: true
            }
          ]
        }
      ]
    }
  ]
})

const switchTreeSelect = () => {
  treeData.value.selected++
  if (treeData.value.selected > 3) {
    treeData.value.selected = 1
  }

  console.log(treeData.value.selected)
}

const treeChange = (e) => {
  treeData.value.selected = e.id

  console.log(treeData.value.selected)
}
</script>

<template>
  <el-container>
    <el-header>Header</el-header>

    <el-container>
      <el-aside>
        <el-text>{{ message.text }}</el-text
        ><br />
        <el-button type="primary">{{ message.text }}</el-button>

        <el-divider />

        <el-text>Color Gradient</el-text><br />
        <el-collapse>
          <div v-for="(color, index) in message.colors" :key="index">
            <el-collapse-item title="ColorStop">
              xxx-color{{ index }}:
              <el-color-picker
                v-model="message.colors[index]"
                @change="
                  (e) => {
                    console.log(e)
                  }
                "
              ></el-color-picker>
              <el-button type="primary" @click="removeColor">-</el-button>
            </el-collapse-item>
          </div>
        </el-collapse>
        <el-button type="primary" @click="addColor">+</el-button>

        <el-divider />

        <el-tree-v2
          :data="treeData.list"
          :default-expanded-keys="[1, 2, 3]"
          :expand-on-click-node="false"
          :current-node-key="treeData.selected"
          @current-change="treeChange"
          :highlight-current="true"
          :height="208"
        >
          <template #default="{ node }">
            <el-icon><Files /></el-icon>
            <span :class="{ gray: node.disabled }">{{ node.label }}</span>
          </template>
        </el-tree-v2>
        <el-button type="primary" @click="switchTreeSelect">Switch Select</el-button>

        <el-divider />
      </el-aside>

      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
