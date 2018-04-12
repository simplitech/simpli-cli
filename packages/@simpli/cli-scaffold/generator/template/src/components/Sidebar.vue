<template>
  <div class="des-w-200 tab-w-200 w-full des-h-window">
    <aside class="menu verti des-w-200 tab-w-200 w-full des-h-window tab-h-window des-fixed tab-fixed y-scroll">
      <div class="horiz items-center">
        <a class="mobile icon icon-menu" @click="toggleMenu"></a>
        <h1 class="weight-1 accent">
          <img src="@/assets/img/logo.png"
               class="ml-10"
               width="32"
               height="32"
               alt="Logo"
               style="vertical-align: middle;">
          <span>
          Webapp
          </span>
        </h1>
      </div>
      <div class="horiz items-center">
        <h3 class="truncate">
          {{user.email}}
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

          <li>
            <router-link to="/listPrincipal" @click.native="menuOff">
              {{ $t('classes.Principal.title') }}
            </router-link>
          </li>

          <li>
            <router-link to="/listUser" @click.native="menuOff">
              {{ $t('classes.User.title') }}
            </router-link>
          </li>

          <li>
            <router-link to="/listEndereco" @click.native="menuOff">
              {{ $t('classes.Endereco.title') }}
            </router-link>
          </li>

          <li>
            <router-link to="/listTag" @click.native="menuOff">
              {{ $t('classes.Tag.title') }}
            </router-link>
          </li>

          <li>
            <router-link to="/listConectado" @click.native="menuOff">
              {{ $t('classes.Conectado.title') }}
            </router-link>
          </li>

          <li>
            <router-link to="/listGrupoDoPrincipal" @click.native="menuOff">
              {{ $t('classes.GrupoDoPrincipal.title') }}
            </router-link>
          </li>

          <li>
            <router-link to="/listItemDoPrincipal" @click.native="menuOff">
              {{ $t('classes.ItemDoPrincipal.title') }}
            </router-link>
          </li>

          <li>
            <router-link to="/listExtensaoDoPrincipal" @click.native="menuOff">
              {{ $t('classes.ExtensaoDoPrincipal.title') }}
            </router-link>
          </li>

          <li>
            <router-link to="/listConectorPrincipal" @click.native="menuOff">
              {{ $t('classes.ConectorPrincipal.title') }}
            </router-link>
          </li>

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
  import User from '@/model/User'

  @Component
  export default class Sidebar extends Vue {
    @Getter('version') version?: string
    @Getter('auth/user') user?: User
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
