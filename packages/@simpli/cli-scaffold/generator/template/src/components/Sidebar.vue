<template>
  <aside class="sidebar">

    <div class="horiz items-center-center">
      <img src="@/assets/img/logo.png" alt="Logo" class="w-8">
      <span class="weight-1 mx-2 font-bold text-xl text-white opacity-75">
        <%- rootOptions.scaffoldSetup.appName %>
      </span>
      <a class="icon icon-menu text-primary p-2 lg:hidden" @click="toggleMenu"></a>
    </div>

    <transition-expand>
      <div class="verti lg:weight-1" v-if="menu || isDesktop">
        <ul class="my-4 grid grid-columns-1 grid-gap-1">
          <li>
            <router-link to="/dashboard" @click.native="menuOff" class="pill horiz h-8 items-center px-3">
              <i class="icon icon-home mr-1"></i>
              {{ $t('view.dashboard.title') }}
            </router-link>
          </li>

<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
<%_ var resources = rootOptions.scaffoldSetup.resourceModels _%>
<%_ for (var i in resources) { var resource = resources[i] _%>
<%_ if (resource.collectionName) { _%>
          <li>
            <router-link to="/<%-kebabCase(resource.name)%>/list" @click.native="menuOff" class="pill horiz h-8 items-center px-3">
              {{ $t('resource.<%-resource.name%>') }}
            </router-link>
          </li>
<%_ } _%>
<%_ } _%>
        </ul>

        <div class="weight-1"></div>
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>

        <a @click="signOut()" class="pill horiz h-8 items-center px-3 mb-1">
          <i class="icon icon-logout mr-1"/>
          {{$t('app.logout')}}
        </a>
<%_ } _%>

        <footer class="p-2 text-white-700 hidden md:block">
          <small>
            <b>Version</b>
            {{version}}
          </small>
        </footer>
      </div>
    </transition-expand>

  </aside>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import {Action, Getter} from 'vuex-class'

  @Component
  export default class Sidebar extends Vue {
    @Getter('version') version!: string
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
    @Action('auth/signOut') signOut!: Function
<%_ } _%>

    menu = false
    screenWidth = window.innerWidth

    get isDesktop() {
      return this.screenWidth >= Number(process.env.VUE_APP_LARGE_SCREEN)
    }

    created() {
      window.addEventListener('resize', this.resizeEvent)
    }

    destroyed() {
      window.removeEventListener('resize', this.resizeEvent)
    }

    resizeEvent() {
      this.screenWidth = window.innerWidth
    }

    toggleMenu() {
      this.menu = !this.menu
    }

    menuOff() {
      this.menu = false
    }
  }
</script>

<style lang="scss" scoped>
  .sidebar {
    @apply verti overflow-y-auto p-2 bg-gray-800 shadow-box-md;
  }

  .translucent-pill {
    @apply rounded-full bg-white-200 text-white-500 font-semibold uppercase tracking-wider transition;
    &:hover {
      @apply bg-white-100 text-white-700;
    }
  }

  .invisible-pill {
    @apply rounded-full text-white-500 font-semibold uppercase tracking-wider transition;
    &:hover {
      @apply bg-white-100 text-white-700;
    }
  }

  .pill {
    @extend .invisible-pill;

    &.router-link-active {
      @extend .translucent-pill;
    }
  }
</style>
