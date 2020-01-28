<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
<template>
  <div class="bg-black-100">
    <div class="container verti min-h-screen items-center-center">
      <img src="@/assets/img/logo.png" class="w-32 h-32 mb-4" alt="logo" />

      <div class="w-full md:w-80 p-4 bg-white shadow-md rounded-lg">
        <form @submit.prevent="$auth.signIn(request)">
          <await name="signIn" :spinnerScale="1.5">
            <div class="font-semibold text-lg text-center uppercase">
              {{ $t('view.signIn.title') }}
            </div>

            <div v-for="(field, i) in schema.allFields" :key="i">
              <render-schema
                v-model="request"
                :schema="schema"
                :field="field"
                class="mb-4"
              />
            </div>

            <div class="mb-2 text-secondary underline">
              <router-link to="/password/recover">
                {{ $t('view.signIn.forgotPassword') }}
              </router-link>
            </div>

            <button
              class="w-full h-12 btn btn--contrast bg-primary"
              type="submit"
            >
              {{ $t('view.signIn.signin') }}
            </button>
          </await>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import {Helper} from 'simpli-web-sdk'
<%_ var loginHolderModel = rootOptions.scaffoldSetup.auth.model.loginHolder _%>
  <%-loginHolderModel.injectIntoDependence().build()%>
<%-loginHolderModel.injectSchemaIntoDependence('Input', false).build(1)%>

@Component
export default class SignInView extends Vue {
  schema = new Input<%-loginHolderModel.name%>Schema()
  request = new <%-loginHolderModel.name%>()

  created() {
    if (this.$auth.isLogged) {
      Helper.push('/dashboard')
    }
  }
}
</script>
<%_ } _%>
