import Mock from 'mockjs-async'

Mock.mock(/api\/login/, 'post', (req) => new Promise(resolve => {
  const body = JSON.parse(req.body || '{}')
  const token = body.username && body.password === '123456' ? 'mock_token_' + Date.now() : ''
  setTimeout(resolve, 300, {
    token: token,
    permissions: [],
    menus: [],
  })
}))
