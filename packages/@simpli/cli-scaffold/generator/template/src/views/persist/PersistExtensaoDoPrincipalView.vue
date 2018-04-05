<template>
  <div class="verti">
    <h1 class="header px-30 py-10 m-0">
      {{ $t("classes.ExtensaoDoPrincipal.title") }}
    </h1>

    <section class="verti scroll weight-1 items-center-top p-30">
      <form @submit.prevent="persist" class="elevated w-full max-w-650 p-20">

        <multiselect-group v-model="model.extensaoDoPrincipal.principal"
                           :items="model.allPrincipal"
                           required
        >
          {{ $t("classes.ExtensaoDoPrincipal.columns.principal") }}
        </multiselect-group>

        <input-group required
                     type="text"
                     maxlength="45"
                     v-model="model.extensaoDoPrincipal.titulo">
          {{ $t("classes.ExtensaoDoPrincipal.columns.titulo") }}
        </input-group>


        <hr class="mb-20"/>
        <div class="verti items-center">
          <button type="submit" class="accent">{{ $t("persist.submit") }}</button>
        </div>
      </form>
    </section>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import ExtensaoDoPrincipalResp from '@/model/response/ExtensaoDoPrincipalResp'
  import {successAndPush, uri, encrypt} from '@/helpers'

  @Component
  export default class PersistExtensaoDoPrincipalView extends Vue {
    @Prop() id?: string
    model: ExtensaoDoPrincipalResp = new ExtensaoDoPrincipalResp()

    async mounted() {
      await this.model.find(this.id || 0)
    }

    async persist() {
      await this.model.extensaoDoPrincipal.validate()
      await this.model.extensaoDoPrincipal.save()
      successAndPush('system.success.persist', uri.listExtensaoDoPrincipal)
    }
  }
</script>
