<template>
  <await name="authenticate" spinner="FadeLoader">
    <main>
      <sidebar/>
      <transition name="fade-down" mode="out-in">
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
        <router-view v-if="authorized" class="weight-1 des-w-0 tab-w-0 mob-w-full"/>
<%_ } else { _%>
        <router-view class="weight-1 des-w-0 tab-w-0 mob-w-full"/>
<%_ } _%>
      </transition>
    </main>
  </await>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
import {Getter, Action} from 'vuex-class'
<%_ } _%>
import Sidebar from '@/components/Sidebar.vue'
import {$, SocketConnection} from '@/simpli'

@Component({
  components: { Sidebar },
})
export default class DefaultPanelLayout extends Vue {
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
  @Getter('auth/notification') notification?: SocketConnection<String>
  @Action('auth/auth') auth!: Function

  authorized = false

  async mounted() {
    await this.auth()
    this.authorized = true

    if (this.notification) {
      this.notification.onData((resp) => $.snotify.info(resp))
    }
  }
<%_ } _%>
}
</script>
