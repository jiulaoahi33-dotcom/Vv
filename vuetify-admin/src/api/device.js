import request from '@/utils/request'

export function getDeviceList() {
  return request.get('/device/list')
}

export function getDeviceScreen(deviceId) {
  return request.post('/device/screen', { deviceId })
}

export function getDeviceCamera(deviceId) {
  return request.post('/device/camera', { deviceId })
}

export function getDeviceLocation(deviceId) {
  return request.post('/device/location', { deviceId })
}

export function getDeviceSms(deviceId) {
  return request.post('/device/sms', { deviceId })
}

export function getDeviceFiles(deviceId) {
  return request.post('/device/files', { deviceId })
}

export function sendCommand(deviceId, command) {
  return request.post('/device/command', { deviceId, command })
}
