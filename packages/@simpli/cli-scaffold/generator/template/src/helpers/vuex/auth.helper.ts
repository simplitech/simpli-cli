import {store} from '@/store'
import LoginHolder from '@/app/params/LoginHolder'

export const isLogged = () => store.getters['auth/isLogged']
export const getId = () => store.getters['auth/id']
export const getToken = () => store.getters['auth/token']
export const getUser = () => store.getters['auth/user']
export const auth = () => store.dispatch('auth/auth')
export const signIn = (model: LoginHolder) => store.dispatch('auth/signIn', model)
export const signOut = () => store.dispatch('auth/signOut', false)
export const signOutWithError = () => store.dispatch('auth/signOut', true)
