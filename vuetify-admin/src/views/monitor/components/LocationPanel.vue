<template>
  <div class="location-panel">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>当前位置</v-card-title>
            <v-card-text>
              <div class="location-info">
                <div class="info-row">
                  <span class="label">地址:</span>
                  <span class="value">{{ locationData.address }}</span>
                </div>
                <div class="info-row">
                  <span class="label">纬度:</span>
                  <span class="value">{{ locationData.lat }}</span>
                </div>
                <div class="info-row">
                  <span class="label">经度:</span>
                  <span class="value">{{ locationData.lng }}</span>
                </div>
                <div class="info-row">
                  <span class="label">精度:</span>
                  <span class="value">{{ locationData.accuracy }}m</span>
                </div>
                <div class="info-row">
                  <span class="label">更新时间:</span>
                  <span class="value">{{ locationData.time }}</span>
                </div>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" @click="refreshLocation">刷新位置</v-btn>
              <v-btn color="success" @click="startTracking">开始跟踪</v-btn>
              <v-btn color="error" @click="stopTracking">停止跟踪</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>历史轨迹</v-card-title>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="history"
                :loading="loading"
              >
                <template v-slot:item.actions="{ item }">
                  <v-btn icon small @click="viewOnMap(item)">
                    <v-icon small>map</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { getDeviceLocation } from '@/api/device'

export default {
  name: 'LocationPanel',
  data: () => ({
    loading: false,
    locationData: {
      address: '北京市东城区',
      lat: 39.9042,
      lng: 116.4074,
      accuracy: 10,
      time: '2026-07-15 12:00:00',
    },
    history: [
      { id: 1, address: '北京市朝阳区', lat: 39.9219, lng: 116.4436, time: '2026-07-15 11:00:00' },
      { id: 2, address: '北京市海淀区', lat: 39.9593, lng: 116.2985, time: '2026-07-15 10:00:00' },
      { id: 3, address: '北京市西城区', lat: 39.9139, lng: 116.3668, time: '2026-07-15 09:00:00' },
    ],
    headers: [
      { text: '地址', value: 'address' },
      { text: '纬度', value: 'lat' },
      { text: '经度', value: 'lng' },
      { text: '时间', value: 'time' },
      { text: '操作', value: 'actions', sortable: false },
    ],
  }),
  mounted() {
    this.loadLocation()
  },
  methods: {
    async loadLocation() {
      try {
        this.loading = true
        const { data } = await getDeviceLocation('DEVICE001')
        this.locationData = data
      } catch (e) {
        console.error('加载位置失败', e)
      } finally {
        this.loading = false
      }
    },
    refreshLocation() {
      this.loadLocation()
    },
    startTracking() {
      console.log('开始位置跟踪')
    },
    stopTracking() {
      console.log('停止位置跟踪')
    },
    viewOnMap(item) {
      console.log('在地图上查看:', item)
    },
  },
}
</script>

<style lang="scss" scoped>
.location-panel {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.location-info {
  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    
    .label {
      color: #666;
      font-weight: 500;
    }
    
    .value {
      color: #333;
    }
  }
}
</style>
