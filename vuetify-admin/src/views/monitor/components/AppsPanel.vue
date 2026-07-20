<template>
  <div class="apps-panel">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="search"
            label="搜索应用"
            prepend-icon="search"
            clearable
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="app in filteredApps"
          :key="app.packageName"
          cols="6"
          sm="4"
          md="3"
        >
          <v-card class="app-card" @click="openApp(app.packageName)">
            <v-card-text class="text-center">
              <v-icon size="48" class="app-icon">{{ app.icon }}</v-icon>
              <div class="app-name">{{ app.name }}</div>
              <div class="app-package">{{ app.packageName }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { sendCommand } from '@/api/device'

export default {
  name: 'AppsPanel',
  data: () => ({
    search: '',
    apps: [
      { name: '微信', packageName: 'com.tencent.mm', icon: 'chat' },
      { name: 'QQ', packageName: 'com.tencent.mobileqq', icon: 'chat_bubble' },
      { name: '支付宝', packageName: 'com.eg.android.AlipayGphone', icon: 'account_balance_wallet' },
      { name: '淘宝', packageName: 'com.taobao.taobao', icon: 'shopping_cart' },
      { name: '抖音', packageName: 'com.ss.android.ugc.aweme', icon: 'music_note' },
      { name: '微博', packageName: 'com.sina.weibo', icon: 'public' },
      { name: '百度', packageName: 'com.baidu.searchbox', icon: 'search' },
      { name: '京东', packageName: 'com.jingdong.app.mall', icon: 'store' },
    ],
  }),
  computed: {
    filteredApps() {
      if (!this.search) return this.apps
      return this.apps.filter(app => 
        app.name.includes(this.search) || 
        app.packageName.includes(this.search)
      )
    },
  },
  methods: {
    async openApp(packageName) {
      try {
        await sendCommand('DEVICE001', `monkey -p ${packageName} -c android.intent.category.LAUNCHER 1`)
      } catch (e) {
        console.error('打开应用失败', e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.apps-panel {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.app-card {
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
}

.app-icon {
  color: #1976d2;
}

.app-name {
  font-weight: 500;
  margin-top: 8px;
}

.app-package {
  font-size: 11px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
