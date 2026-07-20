<template>
  <div class="files-panel">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-breadcrumbs :items="breadcrumbs" divider=">">
            <template v-slot:item="{ item }">
              <v-btn
                text
                small
                @click="navigateTo(item.path)"
              >
                {{ item.text }}
              </v-btn>
            </template>
          </v-breadcrumbs>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="files"
            :loading="loading"
            @click:row="handleRowClick"
          >
            <template v-slot:item.name="{ item }">
              <v-icon v-if="item.isDir" color="primary">folder</v-icon>
              <v-icon v-else>insert_drive_file</v-icon>
              {{ item.name }}
            </template>
            <template v-slot:item.size="{ item }">
              {{ item.isDir ? '-' : item.size }}
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn icon small @click.stop="downloadFile(item)">
                <v-icon small>download</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { getDeviceFiles } from '@/api/device'

export default {
  name: 'FilesPanel',
  data: () => ({
    loading: false,
    currentPath: '/',
    files: [],
    headers: [
      { text: '名称', value: 'name' },
      { text: '大小', value: 'size' },
      { text: '修改时间', value: 'modifiedTime' },
      { text: '操作', value: 'actions', sortable: false },
    ],
  }),
  computed: {
    breadcrumbs() {
      const parts = this.currentPath.split('/').filter(p => p)
      const items = [{ text: '根目录', path: '/' }]
      let path = ''
      parts.forEach(part => {
        path += '/' + part
        items.push({ text: part, path })
      })
      return items
    },
  },
  mounted() {
    this.loadFiles()
  },
  methods: {
    async loadFiles() {
      try {
        this.loading = true
        const { data } = await getDeviceFiles('DEVICE001')
        this.files = data.list
      } catch (e) {
        console.error('加载文件列表失败', e)
      } finally {
        this.loading = false
      }
    },
    handleRowClick(item) {
      if (item.isDir) {
        this.navigateTo(item.path)
      }
    },
    navigateTo(path) {
      this.currentPath = path
      this.loadFiles()
    },
    downloadFile(item) {
      if (item.isDir) return
      console.log('下载文件:', item.name)
    },
  },
}
</script>

<style lang="scss" scoped>
.files-panel {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}
</style>
