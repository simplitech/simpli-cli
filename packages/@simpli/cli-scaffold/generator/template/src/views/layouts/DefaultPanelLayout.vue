<template>
  <await name="auth" spinner="FadeLoader">
    <main>
      <sidebar/>
      <transition name="fade-down" mode="out-in">
        <router-view v-if="authorized" class="weight-1 des-w-0 tab-w-0 mob-w-full"/>
      </transition>
    </main>
  </await>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
import {Action} from 'vuex-class'
<%_ } _%>
import Sidebar from '@/components/Sidebar.vue'

@Component({
  components: { Sidebar },
})
export default class DefaultPanelLayout extends Vue {
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
  @Action('auth/auth') auth!: Function

  authorized = false

  async mounted() {
    await this.auth()
    this.authorized = true
  }
<%_ } _%>
}
</script>
