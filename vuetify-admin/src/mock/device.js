import Mock from 'mockjs-async'

Mock.mock(/api\/device\/list/, 'get', () => new Promise(resolve => {
  setTimeout(resolve, 300, {
    list: [
      { deviceId: 'DEVICE001', brand: 'Samsung', model: 'Galaxy S24', androidVersion: '14', ip: '192.168.1.100', online: true, lastSeen: '2026-07-15 12:00:00' },
      { deviceId: 'DEVICE002', brand: 'Xiaomi', model: '14 Pro', androidVersion: '14', ip: '192.168.1.101', online: true, lastSeen: '2026-07-15 11:55:00' },
      { deviceId: 'DEVICE003', brand: 'OPPO', model: 'Find X7', androidVersion: '14', ip: '192.168.1.102', online: false, lastSeen: '2026-07-14 18:30:00' },
    ]
  })
}))

Mock.mock(/api\/device\/location/, 'post', () => new Promise(resolve => {
  setTimeout(resolve, 300, {
    lat: 39.9042, lng: 116.4074, address: '北京市东城区', time: '2026-07-15 12:00:00'
  })
}))

Mock.mock(/api\/device\/screen/, 'post', () => new Promise(resolve => {
  setTimeout(resolve, 300, {
    url: 'https://via.placeholder.com/1080x1920/1a1a2e/ffffff?text=Screen+Stream'
  })
}))

Mock.mock(/api\/device\/camera/, 'post', () => new Promise(resolve => {
  setTimeout(resolve, 300, {
    url: 'https://via.placeholder.com/1080x1920/2d2d44/ffffff?text=Camera+Capture'
  })
}))



Mock.mock(/api\/device\/sms/, 'post', () => new Promise(resolve => {
  setTimeout(resolve, 300, {
    list: [
      { id: 1, address: '13800138000', body: '验证码: 123456', date: '2026-07-15 10:00:00', type: 'inbox' },
      { id: 2, address: '10086', body: '您的话费余额为50元', date: '2026-07-15 09:30:00', type: 'inbox' },
      { id: 3, address: '13800138000', body: '好的，收到', date: '2026-07-14 20:00:00', type: 'sent' },
    ]
  })
}))

Mock.mock(/api\/device\/files/, 'post', () => new Promise(resolve => {
  setTimeout(resolve, 300, {
    path: '/',
    list: [
      { name: 'DCIM', isDir: true, path: '/DCIM', size: '-', modifiedTime: '2026-07-15 10:00' },
      { name: 'Downloads', isDir: true, path: '/Downloads', size: '-', modifiedTime: '2026-07-14 15:00' },
      { name: 'test.txt', isDir: false, size: '1.2 KB', modifiedTime: '2026-07-13 12:00' },
      { name: 'photo.jpg', isDir: false, size: '3.5 MB', modifiedTime: '2026-07-12 08:30' },
    ]
  })
}))

Mock.mock(/api\/device\/command/, 'post', (req) => new Promise(resolve => {
  const body = JSON.parse(req.body || '{}')
  setTimeout(resolve, 300, {
    output: `[${body.command || '未知'}] 命令已执行\n> 返回结果模拟数据`
  })
}))
