<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
<template>
  <div class="verti w-screen h-screen items-center-center bg-black-100">
    <img src="@/assets/img/logo.png" class="w-32 h-32 mb-4" alt="logo">
    <form @submit.prevent="signIn(request)" class="w-full md:w-80 m-4 p-4 bg-white shadow-md rounded-lg">
      <await name="signIn" :spinnerScale="1.5" class="verti">
        <h2 class="font-semibold text-lg text-center uppercase">
          {{ $t('view.signIn.title') }}
        </h2>

        <div v-for="(field, i) in schema.allFields" :key="i">
          <render-schema v-model="request" :schema="schema" :field="field" class="mb-4"/>
        </div>

        <router-link to="/password/recover" class="text-secondary underline mb-2">
          {{ $t('view.signIn.forgotPassword') }}
        </router-link>

        <button class="w-full h-12 btn btn--contrast bg-primary" type="submit">
          {{ $t('view.signIn.signin') }}
        </button>
      </await>
    </form>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import {State, Action, Getter} from 'vuex-class'
  import {Helper} from 'simpli-web-sdk'
<%_ var loginHolderModel = rootOptions.scaffoldSetup.auth.model.loginHolder _%>
  <%-loginHolderModel.injectIntoDependence().build()%>
<%-loginHolderModel.injectSchemaIntoDependence('Input', false).build(1)%>

  @Component
  export default class SignInView extends Vue {
    @Action('auth/signIn') signIn?: Function
    @Getter('auth/isLogged') isLogged!: boolean

    schema = new Input<%-loginHolderModel.name%>Schema()
    request = new <%-loginHolderModel.name%>()

    created() {
      if (this.isLogged) {
        Helper.push('/dashboard')
      }
    }
  }
</script>
<%_ } _%>
