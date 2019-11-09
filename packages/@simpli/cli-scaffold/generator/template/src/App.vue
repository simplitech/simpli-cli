<template>
  <div>
    <transition name="blur" mode="out-in">
      <router-view/>
    </transition>

    <modal-dialog name="dialog"/>

    <vue-snotify :class="toastStyle"/>
  </div>
</template>

<style lang="scss">
  @import './scss/app.scss';
</style>

<script lang="ts">
import {MetaInfo} from 'vue-meta'
import {Component, Vue} from 'vue-property-decorator'
import {Mutation} from 'vuex-class'
import {$, ToastConfig} from 'simpli-web-sdk'
import ModalDialog from '@/components/modals/ModalDialog.vue'

const metaInfo = (): MetaInfo => ({
  title: $.t('app.subtitle') as string,
  titleTemplate: `%s | ${$.t('app.title')}`,
})

@Component({
  metaInfo,
  components: {ModalDialog},
})
export default class App extends Vue {
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
  @Mutation('auth/POPULATE_TOKEN') populateToken!: Function

<%_ } _%>
  get toastStyle() {
    return ToastConfig.ToastDefaultStyle
  }
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>

  created() {
    this.populateToken()
  }
<%_ } _%>
}
</script>
