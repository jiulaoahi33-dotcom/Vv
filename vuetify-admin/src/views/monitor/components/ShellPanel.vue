<template>
  <div class="shell-panel">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>Shell 命令</v-card-title>
            <v-card-text>
              <v-textarea
                v-model="command"
                label="输入命令"
                placeholder="例如: ls -la"
                rows="2"
                @keyup.ctrl.enter="executeCommand"
              />
              <v-btn color="primary" @click="executeCommand">
                执行 (Ctrl+Enter)
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>输出结果</v-card-title>
            <v-card-text>
              <div class="output-area">
                <pre v-if="output">{{ output }}</pre>
                <div v-else class="placeholder">执行命令后将显示输出结果</div>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn text @click="clearOutput">清空</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>常用命令</v-card-title>
            <v-card-text>
              <v-chip-group>
                <v-chip @click="setCommand('ls -la')">ls -la</v-chip>
                <v-chip @click="setCommand('pm list packages')">pm list packages</v-chip>
                <v-chip @click="setCommand('dumpsys battery')">dumpsys battery</v-chip>
                <v-chip @click="setCommand('wm size')">wm size</v-chip>
                <v-chip @click="setCommand('getprop')">getprop</v-chip>
                <v-chip @click="setCommand('netstat -an')">netstat -an</v-chip>
              </v-chip-group>
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
  name: 'ShellPanel',
  data: () => ({
    command: '',
    output: '',
  }),
  methods: {
    async executeCommand() {
      if (!this.command.trim()) return
      try {
        const { data } = await sendCommand('DEVICE001', this.command)
        this.output = data.output || '命令执行成功'
      } catch (e) {
        this.output = `命令执行失败: ${e.message}`
      }
    },
    setCommand(cmd) {
      this.command = cmd
    },
    clearOutput() {
      this.output = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.shell-panel {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.output-area {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 15px;
  border-radius: 4px;
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  
  pre {
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  
  .placeholder {
    color: #666;
    text-align: center;
    padding: 40px 0;
  }
}
</style>
