<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="mb-4">摄像头</h2>
        <p class="grey--text mb-4">设备ID: {{ $route.query.deviceId || '未选择' }}</p>
        <v-alert v-if="!$route.query.deviceId" type="warning" prominent>
          请先从设备列表选择设备
        </v-alert>
        <template v-else>
          <v-btn-toggle v-model="cameraType" mandatory class="mb-4">
            <v-btn value="back">后置</v-btn>
            <v-btn value="front">前置</v-btn>
          </v-btn-toggle>
          <v-img
            v-if="photoUrl"
            :src="photoUrl"
            max-height="60vh"
            contain
            class="grey darken-4 rounded"
          />
          <v-alert v-else type="info" prominent>
            拍照后显示在此
          </v-alert>
          <div class="mt-4">
            <v-btn color="primary" :loading="loading" @click="takePhoto">
              拍照
            </v-btn>
          </div>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getDeviceCamera } from '@/api/device'
import toast from '@/utils/toast'

export default {
  name: 'CameraView',
  data: () => ({
    cameraType: 'back',
    photoUrl: '',
    loading: false,
  }),
  methods: {
    async takePhoto () {
      const deviceId = this.$route.query.deviceId
      if (!deviceId) return
      this.loading = true
      try {
        const { data } = await getDeviceCamera(deviceId)
        this.photoUrl = data.url || ''
      } catch (e) {
        toast.error('拍照失败')
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss">
</style>
