<template>
  <aside class="sidebar" :class="sidebarClass">
    <div class="m-0 lg:my-2 horiz items-center-center">
      <div class="sidebar__title">
        <div class="horiz lg:verti items-center">
          <img
                  src="@/assets/img/logo.png"
                  class="mr-2 h-8 lg:mb-2 lg:h-16 object-contain"
                  alt="Logo"
          />
          {{ $t('app.title') }}
        </div>
      </div>

      <button
              @click="toggleMenu"
              class="sidebar__toggle-menu btn btn--flat btn--icon"
      >
        <i class="fa fa-bars" />
      </button>
    </div>

    <transition-expand>
      <div class="verti lg:weight-1" v-if="desktopMenu">
        <ul class="my-4 grid grid-cols-1 gap-1">
          <li>
            <router-link to="/dashboard" @click.native="menuOff" class="pill">
              <i class="pill__icon fas fa-tachometer-alt mr-1" />
              <div class="pill__content">
                {{ $t('view.dashboard.title') }}
              </div>
            </router-link>
          </li>

<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
<%_ var resources = rootOptions.scaffoldSetup.resourceModels _%>
<%_ for (var i in resources) { var resource = resources[i] _%>
<%_ if (resource.collectionName) { _%>
          <li>
            <router-link
              to="/<%-kebabCase(resource.name)%>/list"
              @click.native="menuOff"
              class="pill"
            >
              <i class="pill__icon fas fa-table mr-1" />
              <div class="pill__content">
                {{ $tc('resource.<%-resource.name%>', 0) }}
              </div>
            </router-link>
          </li>
<%_ } _%>
<%_ } _%>
        </ul>

        <div class="weight-1"></div>
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>

        <a @click="$auth.signOut" class="pill mb-1">
          <i class="pill__icon fas fa-sign-out-alt mr-1" />
          <div class="pill__content">
            {{ $t('app.logout') }}
          </div>
        </a>
<%_ } _%>

        <footer class="p-2 text-white-700 hidden md:block">
          <small><b>v</b>{{ $app.version }}</small>
        </footer>
      </div>
    </transition-expand>
  </aside>
</template>

<script lang="ts">
import {Component, Prop, Watch, Mixins} from 'vue-property-decorator'
import {MixinScreenSize} from '@/components/mixins/MixinScreenSize'

@Component
export default class Sidebar extends Mixins(MixinScreenSize) {
  menu = false

  get sidebarClass() {
    return {
      'sidebar--collapse': !this.genericMenu,
    }
  }

  get genericMenu() {
    return this.menu || !this.isDesktop
  }

  get desktopMenu() {
    return this.menu || this.isDesktop
  }

  created() {
    const menu = localStorage.getItem('menu')

    if (this.isDesktop && menu !== null) {
      this.menu = Boolean(Number(menu))
    } else if (this.isDesktop && menu === null) {
      this.menu = true
    }
  }

  @Watch('menu')
  menuEvent(menu: boolean) {
    const val = menu ? '1' : '0'
    localStorage.setItem('menu', val)
  }

  @Watch('genericMenu', {immediate: true})
  genericMenuEvent(menu: boolean) {
    this.$emit('toggle', menu)
  }

  toggleMenu() {
    this.menu = !this.menu
  }

  menuOff() {
    if (!this.isDesktop) {
      this.menu = false
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  @apply transition fixed w-full verti overflow-y-auto p-2 bg-gray-800 shadow-box-md;

  max-height: 100vh;

  @screen lg {
    @apply w-64;
  }

  @screen print {
    @apply hidden;
  }

  &.sidebar--collapse {
    @apply overflow-x-hidden;

    @screen lg {
      @apply w-20;
    }

    .sidebar__title {
      @apply m-0 w-0 opacity-0;
    }

    .sidebar__toggle-menu {
      transform: translate(-14px, 0);
    }

    .pill {
      .pill__icon {
        @apply p-0 mr-0;
        transform: translate(0.5rem, 0);
      }
      .pill__content {
        @apply opacity-0;
      }
    }
  }

  .sidebar__title {
    @apply transition mx-2 weight-1 text-center font-light tracking-widest text-xl text-white select-none;

    @screen lg {
      @apply w-48;
    }
  }

  .sidebar__toggle-menu {
    @apply transition text-white;
  }

  /* width */
  &::-webkit-scrollbar {
    width: 0.25rem;
    height: 0.25rem;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.2);
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    @apply bg-secondary;
  }

  &:hover {
    /* Track */
    &::-webkit-scrollbar-thumb {
      @apply bg-secondary;
    }
  }
}

.pill {
  @apply horiz h-8 items-center px-3 rounded overflow-hidden text-white-700 font-medium uppercase tracking-wider transition;

  &:hover {
    @apply bg-white-100 text-white-700;
  }

  .pill__icon {
    @apply transition mr-1 pr-2 text-center;
    font-size: 150%;
  }

  .pill__content {
    @apply transition fix-truncate;
  }

  &.router-link-active {
    @apply rounded bg-secondary text-white-700 font-semibold uppercase tracking-wider transition;
  }
}
</style>
