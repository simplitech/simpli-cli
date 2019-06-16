<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
<template>
  <div class="container verti w-window h-window items-center">
    <form @submit.prevent="signIn(request)" class="des-w-300 tab-w-400 mob-w-full">
      <await name="signIn" :spinnerScale="1.5">
        <h2 class="text-center text-uppercase contrast">
          {{ $t('view.signIn.title') }}
        </h2>

        <div v-for="(field, i) in schema.allFields" :key="i">
          <render-schema v-model="request" :schema="schema" :field="field"/>
        </div>

        <div class="horiz items-space-between">
          <router-link to="/password/recover" class="text-link contrast">
            {{ $t('view.signIn.forgotPassword') }}
          </router-link>
        </div>

        <button class="secondary fluid" type="submit">
          {{ $t('view.signIn.signin') }}
        </button>
      </await>
    </form>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import {State, Action, Getter} from 'vuex-class'
  import {Helper} from '@/simpli'
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
