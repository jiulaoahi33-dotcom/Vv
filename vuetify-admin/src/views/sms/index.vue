<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">短信管理</h2>
        <p class="grey--text mb-4">设备ID: {{ $route.query.deviceId || '未选择' }}</p>
        <v-alert v-if="!$route.query.deviceId" type="warning" prominent>
          请先从设备列表选择设备
        </v-alert>
        <template v-else>
          <v-btn color="primary" :loading="loading" @click="fetchSms" class="mb-4">
            获取短信
          </v-btn>
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-center">号码</th>
                <th class="text-center">内容</th>
                <th class="text-center">时间</th>
                <th class="text-center">类型</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="msg in messages" :key="msg.id">
                <td class="text-center">{{ msg.address }}</td>
                <td>{{ msg.body }}</td>
                <td class="text-center">{{ msg.date }}</td>
                <td class="text-center">
                  <v-chip :color="msg.type === 'inbox' ? 'primary' : 'success'" small dark>
                    {{ msg.type === 'inbox' ? '收件' : '发件' }}
                  </v-chip>
                </td>
              </tr>
              <tr v-if="!messages.length">
                <td colspan="4" class="text-center grey--text">暂无短信数据</td>
              </tr>
            </tbody>
          </v-simple-table>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getDeviceSms } from '@/api/device'
import toast from '@/utils/toast'

export default {
  name: 'SmsView',
  data: () => ({
    messages: [],
    loading: false,
  }),
  methods: {
    async fetchSms () {
      const deviceId = this.$route.query.deviceId
      if (!deviceId) return
      this.loading = true
      try {
        const { data } = await getDeviceSms(deviceId)
        this.messages = data.list || []
      } catch (e) {
        toast.error('获取短信失败')
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss">
</style>
