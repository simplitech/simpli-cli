<%_ if (rootOptions.scaffoldSetup.useAuth && rootOptions.scaffoldSetup.auth.model.recoverPasswordByMailRequest) { _%>
<template>
  <div class="bg-black-100">
    <div class="container verti min-h-screen items-center-center">
      <img src="@/assets/img/logo.png" class="w-32 h-32 mb-4" alt="logo" />

      <div class="w-full md:w-80 p-4 bg-white shadow-md rounded-lg">
        <form @submit.prevent="submit">
          <await name="recoverPasswordByMail" :spinnerScale="1.5">
            <div class="mb-4 font-semibold text-lg text-center uppercase">
              {{ $t('view.recoverPasswordByMail.title') }}
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
              <router-link to="/sign-in">
                {{ $t('view.recoverPasswordByMail.signIn') }}
              </router-link>
            </div>

            <button
              class="w-full h-12 btn btn--contrast bg-primary"
              type="submit"
            >
              {{ $t('view.recoverPasswordByMail.submit') }}
            </button>
          </await>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
<%_ var recoverPasswordByMailRequestModel = rootOptions.scaffoldSetup.auth.model.recoverPasswordByMailRequest _%>
<%-recoverPasswordByMailRequestModel.injectIntoDependence().build()%>
<%-recoverPasswordByMailRequestModel.injectSchemaIntoDependence('Input', false).build(1)%>

@Component
export default class RecoverPasswordByMailView extends Vue {
  schema = new Input<%-recoverPasswordByMailRequestModel.name%>Schema()
  request = new <%-recoverPasswordByMailRequestModel.name%>()

  async submit() {
    await this.request.recoverPasswordByMail()
    this.$toast.success('system.success.recoverPasswordByMail')
    await this.$nav.push('/sign-in')
  }
}
</script>
<%_ } _%>
