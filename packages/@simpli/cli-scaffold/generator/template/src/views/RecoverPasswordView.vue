<%_ if (rootOptions.scaffoldSetup.useAuth && rootOptions.scaffoldSetup.auth.model.recoverPasswordRequest) { _%>
<template>
  <div class="container verti w-window h-window items-center">
    <form @submit.prevent="recoverPassword(request)" class="des-w-300 tab-w-400 mob-w-full">
      <await name="recoverPassword" :spinnerScale="1.5">
        <h2 class="text-center text-uppercase contrast">
          {{ $t('view.recoverPassword.title') }}
        </h2>

        <input-text v-model="request.newPassword" type="password" class="contrast" :placeholder="$t('view.recoverPassword.newPassword')"/>
        <input-text v-model="request.confirmPassword" type="password" class="contrast" :placeholder="$t('view.recoverPassword.confirmPassword')"/>

        <button class="secondary fluid" type="submit">
          {{ $t('view.recoverPassword.submit') }}
        </button>
      </await>
    </form>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import { State, Action, Getter } from 'vuex-class'
<%_ var recoverPasswordRequestModel = rootOptions.scaffoldSetup.auth.model.recoverPasswordRequest _%>
  <%-recoverPasswordRequestModel.injectIntoDependence().build()%>

  @Component
  export default class RecoverPasswordView extends Vue {
    @Prop({type: [String, Number]}) hash?: string
    @Action('auth/recoverPassword') recoverPassword!: Function

    request = new <%-recoverPasswordRequestModel.name%>()

    created() {
      this.request.hash = this.hash || null
    }
  }
</script>
<%_ } _%>
