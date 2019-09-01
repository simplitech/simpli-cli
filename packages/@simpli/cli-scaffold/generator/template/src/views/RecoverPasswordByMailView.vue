<%_ if (rootOptions.scaffoldSetup.useAuth && rootOptions.scaffoldSetup.auth.model.recoverPasswordByMailRequest) { _%>
<template>
  <div class="verti w-screen h-screen items-center-center bg-black-100">
    <img src="@/assets/img/logo.png" class="w-32 h-32 mb-4" alt="logo">
    <form @submit.prevent="recoverPasswordByMail(request)" class="w-full md:w-80 m-4 p-4 bg-white shadow-md rounded-lg">
      <await name="recoverPasswordByMail" :spinnerScale="1.5" class="verti">
        <h2 class="font-semibold text-lg text-center uppercase">
          {{ $t('view.recoverPasswordByMail.title') }}
        </h2>

        <div v-for="(field, i) in schema.allFields" :key="i">
          <render-schema v-model="request" :schema="schema" :field="field" class="mb-4"/>
        </div>

        <div class="horiz justify-between">
          <router-link to="/sign-in" class="text-secondary underline mb-2">
            {{ $t('view.recoverPasswordByMail.signIn') }}
          </router-link>
        </div>

        <button class="w-full h-12 btn btn--contrast bg-primary" type="submit">
          {{ $t('view.recoverPasswordByMail.submit') }}
        </button>
      </await>
    </form>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import {Action, Getter} from 'vuex-class'
<%_ var recoverPasswordByMailRequestModel = rootOptions.scaffoldSetup.auth.model.recoverPasswordByMailRequest _%>
  <%-recoverPasswordByMailRequestModel.injectIntoDependence().build()%>
<%-recoverPasswordByMailRequestModel.injectSchemaIntoDependence('Input', false).build(1)%>

  @Component
  export default class RecoverPasswordByMailView extends Vue {
    @Action('auth/recoverPasswordByMail') recoverPasswordByMail!: Function

    schema = new Input<%-recoverPasswordByMailRequestModel.name%>Schema()
    request = new <%-recoverPasswordByMailRequestModel.name%>()
  }
</script>
<%_ } _%>
