<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
<template>
  <div class="container verti w-window h-window items-center">
    <form @submit.prevent="submit" class="des-w-300 tab-w-400 mob-w-full">
      <await name="recoverPassword" :spinnerScale="1.5">
        <h2 class="text-center text-uppercase contrast">
          {{ $t('view.recoverPassword.title') }}
        </h2>

        <input-text v-model="model.<%-rootOptions.scaffoldSetup.auth.passwordAttrName%>" type="password" class="contrast" :placeholder="$t('view.recoverPassword.newPassword')"/>
        <input-text v-model="<%-rootOptions.scaffoldSetup.auth.passwordAttrName%>" type="password" class="contrast" :placeholder="$t('view.recoverPassword.confirmPassword')"/>

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
<%_ var loginHolderModel = rootOptions.scaffoldSetup.auth.model.loginHolder _%>
  <%-loginHolderModel.injectIntoDependence().build()%>
  import { error } from '@/simpli'

  @Component
  export default class RecoverPasswordView extends Vue {
    @Prop({type: [String, Number]}) hash?: string
    @Action('auth/recoverPassword') recoverPassword?: Function

    model = new <%-loginHolderModel.name%>()
    <%-rootOptions.scaffoldSetup.auth.passwordAttrName%>: string | null = null

<%_ if (loginHolderModel.hasHashAttr) { _%>
    created() {
      this.model.hash = this.hash!
    }
<%_ } _%>

    submit() {
      if (this.<%-rootOptions.scaffoldSetup.auth.passwordAttrName%> !== this.model.<%-rootOptions.scaffoldSetup.auth.passwordAttrName%>) {
        error('system.error.samePassword')
        return
      }
      this.recoverPassword!(this.model)
    }
  }
</script>
<%_ } _%>
