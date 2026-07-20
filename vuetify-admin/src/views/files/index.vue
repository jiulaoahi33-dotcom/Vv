<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">文件管理</h2>
        <p class="grey--text mb-4">设备ID: {{ $route.query.deviceId || '未选择' }}</p>
        <v-alert v-if="!$route.query.deviceId" type="warning" prominent>
          请先从设备列表选择设备
        </v-alert>
        <template v-else>
          <v-row class="mb-4">
            <v-col cols="8">
              <v-text-field v-model="currentPath" label="路径" prepend-icon="folder" readonly />
            </v-col>
            <v-col cols="4">
              <v-btn color="primary" :loading="loading" @click="fetchFiles">
                刷新
              </v-btn>
            </v-col>
          </v-row>
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-center">名称</th>
                <th class="text-center">大小</th>
                <th class="text-center">修改时间</th>
                <th class="text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="file in files" :key="file.name" @click="navigate(file)" style="cursor: pointer;">
                <td>
                  <v-icon small class="mr-2">{{ file.isDir ? 'folder' : 'insert_drive_file' }}</v-icon>
                  {{ file.name }}
                </td>
                <td class="text-center">{{ file.isDir ? '-' : file.size }}</td>
                <td class="text-center">{{ file.modifiedTime || '-' }}</td>
                <td class="text-center">
                  <v-btn v-if="!file.isDir" icon small color="primary" @click.stop="downloadFile(file.name)">
                    <v-icon>download</v-icon>
                  </v-btn>
                  <v-btn icon small color="error" @click.stop="deleteFile(file.name)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
              </tr>
              <tr v-if="!files.length">
                <td colspan="4" class="text-center grey--text">暂无文件</td>
              </tr>
            </tbody>
          </v-simple-table>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getDeviceFiles } from '@/api/device'
import toast from '@/utils/toast'

export default {
  name: 'FilesView',
  data: () => ({
    files: [],
    loading: false,
    currentPath: '/',
  }),
  methods: {
    async fetchFiles () {
      const deviceId = this.$route.query.deviceId
      if (!deviceId) return
      this.loading = true
      try {
        const { data } = await getDeviceFiles(deviceId)
        this.files = data.list || []
        this.currentPath = data.path || '/'
      } catch (e) {
        toast.error('获取文件列表失败')
      } finally {
        this.loading = false
      }
    },
    navigate (file) {
      if (file.isDir) {
        this.currentPath = file.path
        this.fetchFiles()
      }
    },
    downloadFile (name) {
      toast.success('下载功能待实现')
    },
    deleteFile (name) {
      toast.success('删除功能待实现')
    },
  },
  mounted () {
    this.fetchFiles()
  },
}
</script>

<style lang="scss">
</style>
