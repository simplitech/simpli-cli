<template>
  <await name="authenticate" spinner="FadeLoader">
    <main class="verti lg:horiz min-h-screen w-screen">
      <sidebar class="z-20 w-full lg:w-56 lg:h-screen"/>

      <transition name="fade-down" mode="out-in">
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
        <router-view v-if="authorized" class="weight-1"/>
<%_ } else { _%>
        <router-view class="weight-1"/>
<%_ } _%>
      </transition>
    </main>
  </await>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import Sidebar from '@/components/Sidebar.vue'

@Component({
  components: { Sidebar },
})
export default class AuthLayout extends Vue {
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
  authorized = false

  async mounted() {
    await this.$auth.authenticate()
    this.authorized = true
  }
<%_ } _%>
}
</script>
