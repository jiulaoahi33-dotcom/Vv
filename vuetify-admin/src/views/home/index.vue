<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-2">控制面板</h2>
        <p class="grey--text">欢迎使用风控面板，请从左侧导航选择功能。</p>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text class="text-center">
            <v-icon x-large color="primary">devices</v-icon>
            <div class="headline mt-2">{{ deviceCount }}</div>
            <div class="grey--text">在线设备</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text class="text-center">
            <v-icon x-large color="primary">message</v-icon>
            <div class="headline mt-2">{{ smsCount }}</div>
            <div class="grey--text">今日短信</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text class="text-center">
            <v-icon x-large color="primary">room</v-icon>
            <div class="headline mt-2">{{ locationCount }}</div>
            <div class="grey--text">定位请求</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text class="text-center">
            <v-icon x-large color="primary">tv</v-icon>
            <div class="headline mt-2">{{ screenCount }}</div>
            <div class="grey--text">串流请求</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  data: () => ({
    deviceCount: 0,
    smsCount: 0,
    locationCount: 0,
    screenCount: 0,
  }),
}
</script>

<style lang="scss">
</style>
