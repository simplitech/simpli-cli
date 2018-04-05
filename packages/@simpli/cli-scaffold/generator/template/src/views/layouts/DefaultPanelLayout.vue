<template>
  <main class="horiz nowrap h-window mob-verti">
    <sidebar/>
    <router-view class="weight-1 des-w-0 tab-w-0 mob-w-full"/>
  </main>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import {Action} from 'vuex-class'
import Sidebar from '@/components/Sidebar.vue'

@Component({
  components: { Sidebar },
})
export default class DefaultPanelLayout extends Vue {
  @Action('auth/auth') auth?: Function

  created() {
    this.auth!()
  }
}
</script>
