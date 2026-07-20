<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="mb-4">屏幕串流</h2>
        <p class="grey--text mb-4">设备ID: {{ $route.query.deviceId || '未选择' }}</p>
        <v-img
          v-if="screenUrl"
          :src="screenUrl"
          max-height="70vh"
          contain
          class="grey darken-4 rounded"
        />
        <v-alert v-else type="info" prominent>
          串流画面将在此显示
        </v-alert>
        <div class="mt-4">
          <v-btn color="primary" :loading="loading" @click="startStream">
            {{ streaming ? '停止' : '开始串流' }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getDeviceScreen } from '@/api/device'
import toast from '@/utils/toast'

export default {
  name: 'ScreenStream',
  data: () => ({
    screenUrl: '',
    loading: false,
    streaming: false,
    intervalId: null,
  }),
  methods: {
    async startStream () {
      if (this.streaming) {
        this.stopStream()
        return
      }
      const deviceId = this.$route.query.deviceId
      if (!deviceId) {
        toast.error('请先选择设备')
        return
      }
      this.loading = true
      try {
        const { data } = await getDeviceScreen(deviceId)
        this.screenUrl = data.url || ''
        this.streaming = true
        this.intervalId = setInterval(async () => {
          try {
            const d2 = await getDeviceScreen(deviceId)
            this.screenUrl = d2.data.url || this.screenUrl
          } catch (e) {}
        }, 3000)
      } catch (e) {
        toast.error('获取串流失败')
      } finally {
        this.loading = false
      }
    },
    stopStream () {
      clearInterval(this.intervalId)
      this.screenUrl = ''
      this.streaming = false
      this.intervalId = null
    },
  },
  beforeDestroy () {
    clearInterval(this.intervalId)
  },
}
</script>

<style lang="scss">
</style>
