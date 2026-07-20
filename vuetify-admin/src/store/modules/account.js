import { login } from '@/api/account'
import router from '@/router'
import { buildDynamicRoutes, resetRouter, ENTRY_ROUTE } from '@/router'
import { RunTimeMutations } from './runTime'

export const AccountMutations = {
  SET_PERMISSIONS: 'SET_PERMISSIONS',
  SET_MENUS: 'SET_MENUS',
  SET_TOKEN: 'SET_TOKEN',
}

export const AccountActions = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  BUILD_ROUTES: 'BUILD_ROUTES',
}

const DEFAULT_MENUS = [
  {
    text: '设备监控',
    icon: 'monitor',
    hidden: false,
    to: '/monitor',
    permissions: [],
    type: 'VIEW',
    resource: 'monitor/index',
  },
  {
    text: '屏幕控制',
    icon: 'tv',
    hidden: false,
    to: '/screen',
    permissions: [],
    type: 'VIEW',
    resource: 'screen/index',
  },
  {
    text: '摄像头',
    icon: 'videocam',
    hidden: false,
    to: '/camera',
    permissions: [],
    type: 'VIEW',
    resource: 'camera/index',
  },
  {
    text: '音频',
    icon: 'mic',
    hidden: false,
    to: '/audio',
    permissions: [],
    type: 'VIEW',
    resource: 'audio/index',
  },
  {
    text: '定位',
    icon: 'room',
    hidden: false,
    to: '/location',
    permissions: [],
    type: 'VIEW',
    resource: 'location/index',
  },
  {
    text: '设备操作',
    icon: 'smartphone',
    hidden: false,
    to: '/deviceops',
    permissions: [],
    type: 'VIEW',
    resource: 'deviceops/index',
  },
  {
    text: '隐藏管理',
    icon: 'visibility_off',
    hidden: false,
    to: '/hidden',
    permissions: [],
    type: 'VIEW',
    resource: 'hidden/index',
  },
]

export default {
  namespaced: true,
  state: {
    permissions: [],
    menus: [],
    token: '',
  },
  mutations: {
    [AccountMutations.SET_PERMISSIONS] (state, permissions = []) {
      state.permissions = permissions
    },
    [AccountMutations.SET_MENUS] (state, menus = []) {
      state.menus = menus
    },
    [AccountMutations.SET_TOKEN] (state, token = '') {
      state.token = token
    },
  },
  actions: {
    async [AccountActions.LOGIN] ({ commit, dispatch }, payload) {
      const { data: d } = await login(payload)
      commit(AccountMutations.SET_TOKEN, d.token || 'logged_in')
      commit(AccountMutations.SET_PERMISSIONS, d.permissions || [])
      commit(AccountMutations.SET_MENUS, DEFAULT_MENUS)
      await dispatch(AccountActions.BUILD_ROUTES)
    },
    async [AccountActions.BUILD_ROUTES] ({ state, getters }) {
      if (getters.hasLoggedIn) {
        buildDynamicRoutes(state.menus)
        const redirectedFrom = location.hash.replace('#', '')
        const to = { path: '/' }

        if (redirectedFrom !== ENTRY_ROUTE.path) {
          to.query = { redirectedFrom }
        }

        await router.push(to)
      }
    },
    async [AccountActions.LOGOUT] ({ commit }) {
      await router.push(ENTRY_ROUTE.path)
      commit(AccountMutations.SET_PERMISSIONS, [])
      commit(AccountMutations.SET_MENUS, [])
      commit(AccountMutations.SET_TOKEN, '')
      commit(`runTime/${RunTimeMutations.SET_OPENED_ROUTES}`, [], { root: true })
      resetRouter()
    },
  },
  getters: {
    hasLoggedIn (state) {
      return !!state.token
    },
  },
}
