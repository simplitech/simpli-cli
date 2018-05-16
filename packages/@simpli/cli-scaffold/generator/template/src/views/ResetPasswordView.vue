<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
<template>
  <div class="entry-view verti w-window h-window items-center p-10">
    <form @submit.prevent="resetPassword(model)" class="des-w-300 tab-w-400 mob-w-full elevated p-20">
      <await name="resetPassword" :spinnerScale="1.5">
        <h2 class="text-center accent mt-0">{{ $t("view.resetPassword.title") }}</h2>

        <input-group v-model="model.<%-rootOptions.scaffoldSetup.auth.accountAttrName%>" type="text" :placeholder="$t('view.resetPassword.account')" autofocus/>

        <div class="horiz items-space-between mb-10">
          <router-link to="/login">
            {{ $t('view.resetPassword.signIn') }}
          </router-link>
        </div>

        <button class="accent w-full" type="submit">{{ $t("view.resetPassword.submit") }}</button>
      </await>
    </form>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import { State, Action, Getter } from 'vuex-class'
<%_ var loginHolderModel = rootOptions.scaffoldSetup.auth.model.loginHolder _%>
  <%-loginHolderModel.injectIntoDependence().build()%>

  @Component
  export default class ResetPasswordView extends Vue {
    @Action('auth/resetPassword') resetPassword?: Function
    model = new LoginHolder()
  }
</script>
<%_ } _%>
