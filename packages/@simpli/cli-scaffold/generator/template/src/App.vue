<template>
  <div>
    <transition name="blur" mode="out-in">
      <router-view/>
    </transition>
    <vue-snotify :class="toastStyle"/>
  </div>
</template>

<style lang="scss">
  @import './scss/app.scss';
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {Action, Getter} from 'vuex-class'
import {ToastDefaultConfig, ToastDefaultStyle, ToastGlobalConfig, ToastStyle} from '@/simpli'

@Component
export default class App extends Vue {
  @Action('auth/onSignIn') onSignIn!: Function
  @Action('auth/onAuth') onAuth!: Function
  @Action('auth/onSignOut') onSignOut!: Function

  toastStyle: ToastStyle = ToastDefaultStyle

  // When the user or system signs in
  signInEvent() {
    //
  }

  // When an auth view is accessed successfully
  authEvent() {
    //
  }

  // When the user or system signs out
  signOutEvent() {
    //
  }

  // Standard Behaviours
  created() {
    this.onSignIn(this.signInEvent)
    this.onAuth(this.authEvent)
    this.onSignOut(this.signOutEvent)

    this.$snotify.setDefaults({
      global: ToastGlobalConfig,
      toast: ToastDefaultConfig,
    })
  }
}
</script>
