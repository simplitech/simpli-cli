<%_ if (rootOptions.scaffoldSetup.useAuth && rootOptions.scaffoldSetup.auth.model.resetPasswordRequest) { _%>
<template>
  <div class="verti w-screen h-screen items-center-center bg-black-100">
    <img src="@/assets/img/logo.png" class="w-32 h-32 mb-4" alt="logo">
    <form @submit.prevent="resetPassword(request)" class="w-full md:w-80 m-4 p-4 bg-white shadow-md rounded-lg">
      <await name="resetPassword" :spinnerScale="1.5" class="verti">
        <h2 class="font-semibold text-lg text-center uppercase">
          {{ $t('view.resetPassword.title') }}
        </h2>

        <div v-for="(field, i) in schema.allFields" :key="i">
          <render-schema v-model="request" :schema="schema" :field="field" class="mb-4"/>
        </div>

        <button class="w-full h-12 btn btn--contrast bg-primary" type="submit">
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
      this.request.hash = this.hash ?? null
    }
  }
</script>
<%_ } _%>
