<template>
  <div class="sms-panel">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="smsList"
            :loading="loading"
          >
            <template v-slot:item.type="{ item }">
              <v-chip :color="item.type === 'inbox' ? 'primary' : 'success'" small>
                {{ item.type === 'inbox' ? '收件箱' : '已发送' }}
              </v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn icon small @click="viewSms(item)">
                <v-icon small>visibility</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>发送短信</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="newSms.address"
                label="手机号"
                prepend-icon="phone"
              />
              <v-textarea
                v-model="newSms.body"
                label="短信内容"
                prepend-icon="message"
                rows="3"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" @click="sendSms">发送</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { getDeviceSms } from '@/api/device'
import { sendCommand } from '@/api/device'

export default {
  name: 'SmsPanel',
  data: () => ({
    loading: false,
    smsList: [],
    newSms: {
      address: '',
      body: '',
    },
    headers: [
      { text: '发送者', value: 'address' },
      { text: '内容', value: 'body' },
      { text: '时间', value: 'date' },
      { text: '类型', value: 'type' },
      { text: '操作', value: 'actions', sortable: false },
    ],
  }),
  mounted() {
    this.loadSms()
  },
  methods: {
    async loadSms() {
      try {
        this.loading = true
        const { data } = await getDeviceSms('DEVICE001')
        this.smsList = data.list
      } catch (e) {
        console.error('加载短信失败', e)
      } finally {
        this.loading = false
      }
    },
    viewSms(item) {
      console.log('查看短信:', item)
    },
    async sendSms() {
      try {
        await sendCommand('DEVICE001', `am start -a android.intent.action.SENDTO -d sms:${this.newSms.address} --es sms_body "${this.newSms.body}"`)
        this.newSms = { address: '', body: '' }
      } catch (e) {
        console.error('发送短信失败', e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.sms-panel {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}
</style>
