<template>
  <await name="authenticate" spinner="FadeLoader">
    <main class="verti md:horiz w-screen h-screen">
      <sidebar class="w-full md:w-56 lg:h-full"/>
      <transition name="fade-down" mode="out-in">
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
        <router-view v-if="authorized" class="weight-1 h-0 md:h-auto md:w-0"/>
<%_ } else { _%>
        <router-view class="weight-1 h-0 md:h-auto md:w-0"/>
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

@Component({
  components: { Sidebar },
})
export default class AuthLayout extends Vue {
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
