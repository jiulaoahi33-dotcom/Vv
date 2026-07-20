<template>
  <div class="fill-height fill-width overflow-hidden">
    <DataTable
      :headers="headers"
      item-key="deviceId"
      :items="devices"
      :loading="loading"
    >
      <template v-slot:item.deviceId="{ item }">
        <strong>{{ item.deviceId }}</strong>
      </template>
      <template v-slot:item.model="{ item }">
        {{ item.brand }} {{ item.model }}
      </template>
      <template v-slot:item.online="{ item }">
        <v-chip :color="item.online ? 'green' : 'grey'" dark small>
          {{ item.online ? '在线' : '离线' }}
        </v-chip>
      </template>
      <template v-slot:item.lastSeen="{ item }">
        {{ item.lastSeen || '-' }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon small color="primary" @click="viewScreen(item.deviceId)">
          <v-icon>tv</v-icon>
        </v-btn>
        <v-btn icon small color="primary" @click="viewCamera(item.deviceId)">
          <v-icon>videocam</v-icon>
        </v-btn>
        <v-btn icon small color="primary" @click="viewLocation(item.deviceId)">
          <v-icon>room</v-icon>
        </v-btn>
        <v-btn icon small color="primary" @click="viewSms(item.deviceId)">
          <v-icon>message</v-icon>
        </v-btn>
        <v-btn icon small color="primary" @click="viewFiles(item.deviceId)">
          <v-icon>folder</v-icon>
        </v-btn>
      </template>
    </DataTable>
  </div>
</template>

<script>
import { getDeviceList } from '@/api/device'
import toast from '@/utils/toast'

export default {
  name: 'DeviceList',
  data: () => ({
    devices: [],
    loading: false,
  }),
  computed: {
    headers () {
      return [
        { text: '设备ID', align: 'center', value: 'deviceId', width: 150 },
        { text: '型号', align: 'center', value: 'model', width: 180 },
        { text: 'Android版本', align: 'center', value: 'androidVersion', width: 120 },
        { text: 'IP', align: 'center', value: 'ip', width: 140 },
        { text: '状态', align: 'center', value: 'online', width: 80 },
        { text: '最后在线', align: 'center', value: 'lastSeen', width: 160 },
        { text: '操作', align: 'center', value: 'actions', width: 200, sortable: false },
      ]
    },
  },
  methods: {
    async fetch () {
      try {
        this.loading = true
        const { data } = await getDeviceList()
        this.devices = data.list || []
      } catch (e) {
        this.devices = []
        toast.error('获取设备列表失败')
      } finally {
        this.loading = false
      }
    },
    viewScreen (deviceId) {
      this.$router.push(`/screen?deviceId=${deviceId}`)
    },
    viewCamera (deviceId) {
      this.$router.push(`/camera?deviceId=${deviceId}`)
    },
    viewLocation (deviceId) {
      this.$router.push(`/location?deviceId=${deviceId}`)
    },
    viewSms (deviceId) {
      this.$router.push(`/sms?deviceId=${deviceId}`)
    },
    viewFiles (deviceId) {
      this.$router.push(`/files?deviceId=${deviceId}`)
    },
  },
  mounted () {
    this.fetch()
  },
}
</script>

<style lang="scss">
</style>
