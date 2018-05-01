<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
<template>
  <div class="verti w-window h-window items-center">
    <form @submit.prevent="signIn(model)" class="verti w-300 elevated p-30">
      <h2 class="mt-0">{{ $t("view.login.subtitle") }}</h2>
      <input v-model="model.<%-rootOptions.scaffoldSetup.auth.accountAttrName%>" class="mb-10" type="text" :placeholder="$t('view.login.account')" required autofocus/>
      <input v-model="model.<%-rootOptions.scaffoldSetup.auth.passwordAttrName%>" class="mb-10" type="password" :placeholder="$t('view.login.password')" required>
      <button class="accent" type="submit">{{ $t("view.login.signin") }}</button>
    </form>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import { State, Action, Getter } from 'vuex-class'
<%_ var loginHolderModel = rootOptions.scaffoldSetup.auth.model.loginHolder _%>
  <%-loginHolderModel.injectIntoDependence().build()%>

  @Component
  export default class LoginView extends Vue {
    @Action('auth/signIn') signIn?: Function
    model = new <%-loginHolderModel.name%>()
  }
</script>
<%_ } _%>
