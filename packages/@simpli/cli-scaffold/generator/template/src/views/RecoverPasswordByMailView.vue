<%_ if (rootOptions.scaffoldSetup.useAuth && rootOptions.scaffoldSetup.auth.model.recoverPasswordByMailRequest) { _%>
<template>
  <div class="contrast verti w-window h-window items-center">
    <form @submit.prevent="recoverPasswordByMail(request)" class="des-w-300 tab-w-400 mob-w-full">
      <await name="recoverPasswordByMail" :spinnerScale="1.5">
        <h2 class="text-center text-uppercase contrast">
          {{ $t('view.recoverPasswordByMail.title') }}
        </h2>

        <div v-for="(field, i) in schema.allFields" :key="i">
          <render-schema v-model="request" :schema="schema" :field="field"/>
        </div>

        <div class="horiz items-space-between">
          <router-link to="/sign-in" class="text-link contrast">
            {{ $t('view.recoverPasswordByMail.signIn') }}
          </router-link>
        </div>

        <button class="secondary fluid" type="submit">
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
