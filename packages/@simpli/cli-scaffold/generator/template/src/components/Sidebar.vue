<template>
  <aside class="sidebar verti overflow-y-auto p-2 bg-tertiary z-10">

    <div class="horiz items-center-center">
      <img src="@/assets/img/logo.png" alt="Logo" class="w-8">
        <span class="weight-1 mx-2 font-bold text-xl text-white opacity-75">
          <%- rootOptions.scaffoldSetup.appName %>
        </span>
      <a class="icon icon-menu text-primary p-2 md:hidden" @click="toggleMenu"></a>
    </div>

    <!-- menu, always visible on tablets and desktop, hidden on mobile if 'menu' is false-->
    <div class="md:weight-1 md:block" :class="{ hidden: !menu }">
      <ul class="verti h-full py-4">

        <li>
          <router-link to="/dashboard" @click.native="menuOff" class="pill horiz h-8 items-center px-3 mb-1">
            <i class="icon icon-home mr-1"></i>
            {{ $t('view.dashboard.title') }}
          </router-link>
        </li>

<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
<%_ var resources = rootOptions.scaffoldSetup.resourceModels _%>
<%_ for (var i in resources) { var resource = resources[i] _%>
<%_ if (resource.collectionName) { _%>
        <li>
          <router-link to="/<%-kebabCase(resource.name)%>/list" @click.native="menuOff" class="pill horiz h-8 items-center px-3 mb-1">
            {{ $t('resource.<%-resource.name%>') }}
          </router-link>
        </li>
<%_ } _%>
<%_ } _%>

        <div class="weight-1"></div>
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>

        <li>
          <a @click="signOut()" class="pill horiz h-8 items-center px-3 mb-1">
            <i class="icon icon-logout mr-1"/>
            {{$t('app.logout')}}
          </a>
        </li>
<%_ } _%>
      </ul>

    </div>

    <footer class="p-2 text-white-700 hidden md:block">
      <small>
        <b>Version</b>
        {{version}}
      </small>
    </footer>

  </aside>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import {Action, Getter} from 'vuex-class'

  @Component
  export default class Sidebar extends Vue {
    @Getter('version') version!: string
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
    // @Getter('auth/user') user?: User
    @Action('auth/signOut') signOut!: Function
<%_ } _%>

    menu: boolean = false

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
    box-shadow: 0 0 30px rgba(0, 0, 0, .5);
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
