<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">控制台</h2>
        <v-row>
          <v-col cols="4">
            <v-text-field v-model="deviceId" label="设备ID" prepend-icon="devices" />
          </v-col>
          <v-col cols="8">
            <v-text-field v-model="command" label="命令" prepend-icon="terminal" @keydown.enter="send" />
          </v-col>
        </v-row>
        <v-btn color="primary" :loading="loading" @click="send" class="mb-4">
          发送命令
        </v-btn>
        <v-card outlined class="grey darken-4 white--text pa-4" style=" font-family: monospace;
  min-height: 300px;
  overflow-y: auto;" max-height="500">
          <div v-for="(line, i) in log" :key="i">{{ line }}</div>
          <div v-if="!log.length" class="grey--text">命令输出将显示在此</div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { sendCommand } from '@/api/device'
import toast from '@/utils/toast'

export default {
  name: 'ConsoleView',
  data: () => ({
    deviceId: '',
    command: '',
    loading: false,
    log: [],
  }),
  methods: {
    async send () {
      if (!this.deviceId || !this.command) {
        toast.error('请填写设备ID和命令')
        return
      }
      this.loading = true
      this.log.push(`> ${this.command}`)
      try {
        const { data } = await sendCommand(this.deviceId, this.command)
        this.log.push(data.output || '命令已发送')
      } catch (e) {
        this.log.push('错误: 命令执行失败')
      } finally {
        this.loading = false
        this.command = ''
      }
    },
  },
}
</script>

<style lang="scss">
</style>
