<template>

  <div class="verti">
    <h1 class="header px-30 py-10 m-0">
      {{ $t("classes.GrupoDoPrincipal.title") }}
    </h1>

    <section class="verti scroll weight-1 items-center-top p-30">

      <form @submit.prevent="persist" class="elevated w-full max-w-650 p-20">

        <input-group required
                     type="text"
                     maxlength="45"
                     v-model="model.grupoDoPrincipal.titulo">
          {{ $t("classes.GrupoDoPrincipal.columns.titulo") }}
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
  import GrupoDoPrincipalResp from '@/model/response/GrupoDoPrincipalResp'
  import {successAndPush, uri, encrypt} from '@/helpers'

  @Component
  export default class PersistGrupoDoPrincipalView extends Vue {
    @Prop() id?: string
    model: GrupoDoPrincipalResp = new GrupoDoPrincipalResp()

    async mounted() {
      await this.model.find(this.id || 0)
    }

    async persist() {
      await this.model.grupoDoPrincipal.validate()
      await this.model.grupoDoPrincipal.save()
      successAndPush('system.success.persist', uri.listGrupoDoPrincipal)
    }
  }
</script>
