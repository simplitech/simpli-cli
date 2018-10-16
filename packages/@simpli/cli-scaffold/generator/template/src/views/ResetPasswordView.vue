<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
<template>
  <div class="contrast verti w-window h-window items-center">
    <form @submit.prevent="resetPassword(model)" class="des-w-300 tab-w-400 mob-w-full">
      <await name="resetPassword" :spinnerScale="1.5">
        <h2 class="text-center text-uppercase contrast">
          {{ $t('view.resetPassword.title') }}
        </h2>

        <input-group v-model="model.<%-rootOptions.scaffoldSetup.auth.accountAttrName%>" type="text" class="contrast" :placeholder="$t('view.resetPassword.account')"/>

        <div class="horiz items-space-between">
          <router-link to="/signIn" class="text-link contrast">
            {{ $t('view.resetPassword.signIn') }}
          </router-link>
        </div>

        <button class="secondary fluid" type="submit">
          {{ $t('view.resetPassword.submit') }}
        </button>
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
    model = new <%-loginHolderModel.name%>()
  }
</script>
<%_ } _%>
