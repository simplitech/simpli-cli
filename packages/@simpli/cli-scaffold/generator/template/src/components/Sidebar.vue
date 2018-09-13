<template>
  <div class="sidebar des-w-200 tab-w-200 w-full des-h-window">
    <aside class="verti des-w-200 tab-w-200 w-full des-h-window tab-h-window des-fixed tab-fixed y-scroll">

      <div class="horiz items-center">
        <div class="brand">
          <img src="@/assets/img/logo.png" alt="Logo">
          <span>
            <%- rootOptions.scaffoldSetup.appName %>
          </span>
        </div>

        <a class="mobile icon icon-menu" @click="toggleMenu"></a>
      </div>

      <!--<div class="horiz items-center">-->
      <!--<h3 class="truncate">-->
      <!--{{user.email}}-->
      <!--</h3>-->
      <!--</div>-->

      <div class="weight-1" :class="{ 'desktop-tablet': !menu }">
        <ul>

          <li>
            <router-link to="/dashboard" @click.native="menuOff" class="btn fluid flat contrast">
              <i class="icon icon-home"></i>
              {{ $t('view.dashboard.title') }}
            </router-link>
          </li>

<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
<%_ var resources = rootOptions.scaffoldSetup.resourceModels _%>
<%_ for (var i in resources) { var resource = resources[i] _%>
          <li>
            <router-link to="/<%-kebabCase(resource.name)%>/list" @click.native="menuOff" class="btn fluid flat contrast">
              {{ $t('classes.<%-resource.name%>.title') }}
            </router-link>
          </li>
<%_ } _%>

          <div class="weight-1"></div>
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>

          <li>
            <a @click="signOut(false)" class="btn fluid flat contrast">
              <i class="icon icon-logout"/>
              {{$t('app.logout')}}
            </a>
          </li>
<%_ } _%>
        </ul>

      </div>

      <footer class="p-10 desktop-tablet text-light">
        <small>
          <b>Version</b>
          {{version}}
        </small>
      </footer>

    </aside>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import {Action, Getter} from 'vuex-class'

  @Component
  export default class Sidebar extends Vue {
    @Getter('version') version?: string
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
    // @Getter('auth/user') user?: User
    @Action('auth/signOut') signOut?: Function
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
