<template>
  <div>
    <transition name="blur" mode="out-in">
      <router-view />
    </transition>

    <vue-snotify :class="$config.toast.style" />
  </div>
</template>

<script lang="ts">
import {MetaInfo} from 'vue-meta'
import {Component, Vue} from 'vue-property-decorator'

Component.registerHooks(['metaInfo'])

@Component
export default class App extends Vue {
  metaInfo(): MetaInfo {
    return {
      title: this.$t('app.subtitle') as string,
      titleTemplate: `%s | ${this.$t('app.title')}`,
    }
  }
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>

  created() {
    this.$auth.populateToken()
  }
<%_ } _%>
}
</script>

<style lang="scss">
@import './scss/app.scss';
</style>
