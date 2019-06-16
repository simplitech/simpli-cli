<%_ if (rootOptions.scaffoldSetup.useAuth && rootOptions.scaffoldSetup.auth.model.resetPasswordRequest) { _%>
<template>
  <div class="container verti w-window h-window items-center">
    <form @submit.prevent="resetPassword(request)" class="des-w-300 tab-w-400 mob-w-full">
      <await name="resetPassword" :spinnerScale="1.5">
        <h2 class="text-center text-uppercase contrast">
          {{ $t('view.resetPassword.title') }}
        </h2>

        <div v-for="(field, i) in schema.allFields" :key="i">
          <render-schema v-model="request" :schema="schema" :field="field"/>
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
<%_ var resetPasswordRequestModel = rootOptions.scaffoldSetup.auth.model.resetPasswordRequest _%>
  <%-resetPasswordRequestModel.injectIntoDependence().build()%>
<%-resetPasswordRequestModel.injectSchemaIntoDependence('Input', false).build(1)%>

  @Component
  export default class ResetPasswordView extends Vue {
    @Prop({type: [String, Number]}) hash?: string
    @Action('auth/resetPassword') resetPassword!: Function

    schema = new Input<%-resetPasswordRequestModel.name%>Schema()
    request = new <%-resetPasswordRequestModel.name%>()

    created() {
      this.request.hash = this.hash || null
    }
  }
</script>
<%_ } _%>
