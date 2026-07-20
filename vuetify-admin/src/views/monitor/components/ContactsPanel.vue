<template>
  <div class="contacts-panel">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="search"
            label="搜索联系人"
            prepend-icon="search"
            clearable
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="filteredContacts"
            :loading="loading"
          >
            <template v-slot:item.name="{ item }">
              <v-avatar size="32" color="primary" class="mr-2">
                <v-icon dark>person</v-icon>
              </v-avatar>
              {{ item.name }}
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn icon small @click="callContact(item)">
                <v-icon small>phone</v-icon>
              </v-btn>
              <v-btn icon small @click="smsContact(item)">
                <v-icon small>message</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { sendCommand } from '@/api/device'

export default {
  name: 'ContactsPanel',
  data: () => ({
    loading: false,
    search: '',
    contacts: [
      { id: 1, name: '张三', phone: '13800138000', email: 'zhangsan@example.com' },
      { id: 2, name: '李四', phone: '13900139000', email: 'lisi@example.com' },
      { id: 3, name: '王五', phone: '13700137000', email: 'wangwu@example.com' },
      { id: 4, name: '赵六', phone: '13600136000', email: 'zhaoliu@example.com' },
      { id: 5, name: '孙七', phone: '13500135000', email: 'sunqi@example.com' },
    ],
    headers: [
      { text: '姓名', value: 'name' },
      { text: '电话', value: 'phone' },
      { text: '邮箱', value: 'email' },
      { text: '操作', value: 'actions', sortable: false },
    ],
  }),
  computed: {
    filteredContacts() {
      if (!this.search) return this.contacts
      return this.contacts.filter(contact => 
        contact.name.includes(this.search) || 
        contact.phone.includes(this.search)
      )
    },
  },
  methods: {
    async callContact(contact) {
      try {
        await sendCommand('DEVICE001', `am start -a android.intent.action.CALL -d tel:${contact.phone}`)
      } catch (e) {
        console.error('拨打电话失败', e)
      }
    },
    async smsContact(contact) {
      try {
        await sendCommand('DEVICE001', `am start -a android.intent.action.SENDTO -d sms:${contact.phone}`)
      } catch (e) {
        console.error('发送短信失败', e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.contacts-panel {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}
</style>
