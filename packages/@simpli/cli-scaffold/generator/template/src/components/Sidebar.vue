<template>
  <div class="des-w-200 tab-w-200 w-full des-h-window">
    <aside class="menu verti des-w-200 tab-w-200 w-full des-h-window tab-h-window des-fixed tab-fixed y-scroll">
      <div class="horiz items-center">
        <a class="mobile icon icon-menu" @click="toggleMenu"></a>
        <h1 class="horiz weight-1 accent truncate">
          <img src="@/assets/img/logo.png"
               class="ml-10"
               width="32"
               height="32"
               alt="Logo"
               style="vertical-align: middle;">
          <span class="weight-1 truncate mr-10">
          <%- rootOptions.scaffoldSetup.appName %>
          </span>
        </h1>
      </div>
      <div class="horiz items-center">
        <h3 class="truncate">
          <!--{{user.email}}-->
        </h3>
      </div>
      <div class="weight-1" :class="{ 'desktop-tablet': !menu }">
        <ul class="verti h-full p-0 py-10">

          <li>
            <router-link to="/dashboard" @click.native="menuOff">
              <i class="icon icon-home mr-3"></i>
              {{ $t('view.dashboard.title') }}
            </router-link>
          </li>

<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
<%_ var resources = rootOptions.scaffoldSetup.resourceModels _%>
<%_ for (var i in resources) { var resource = resources[i] _%>
          <li>
            <router-link to="/<%-kebabCase(resource.name)%>/list" @click.native="menuOff">
              {{ $t('classes.<%-resource.name%>.title') }}
            </router-link>
          </li>
<%_ } _%>

          <div class="weight-1"></div>

          <li>
            <a @click="signOut(false)">
              <i class="icon icon-logout mr-3"/>
              {{$t('app.logout')}}
            </a>
          </li>
        </ul>

      </div>

      <footer class="p-10 desktop-tablet">
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
    // @Getter('auth/user') user?: User
    @Getter('version') version?: string
    @Action('auth/signOut') signOut?: Function

    menu: boolean = false

    toggleMenu() {
      this.menu = !this.menu
    }

    menuOff() {
      this.menu = false
    }
  }
</script>
