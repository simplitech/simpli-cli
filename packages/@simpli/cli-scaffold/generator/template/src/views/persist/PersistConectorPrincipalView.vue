<template>
  <div class="verti">
    <h1 class="header px-30 py-10 m-0">
      {{ $t("classes.ConectorPrincipal.title") }}
    </h1>

    <section class="verti scroll weight-1 items-center-top p-30">
      <form @submit.prevent="persist" class="elevated w-full max-w-650 p-20">

        <multiselect-group v-model="model.conectorPrincipal.principal"
                           :items="model.allPrincipal"
                           required
        >
          {{ $t("classes.ConectorPrincipal.columns.principal") }}
        </multiselect-group>

        <multiselect-group v-model="model.conectorPrincipal.conectado"
                           :items="model.allConectado"
                           required
        >
          {{ $t("classes.ConectorPrincipal.columns.conectado") }}
        </multiselect-group>

        <input-group required
                     type="text"
                     maxlength="45"
                     v-model="model.conectorPrincipal.titulo">
          {{ $t("classes.ConectorPrincipal.columns.titulo") }}
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
  import ConectorPrincipalResp from '@/model/response/ConectorPrincipalResp'
  import {successAndPush} from '@/simpli'

  @Component
  export default class PersistConectorPrincipalView extends Vue {
    @Prop() id1?: string
    @Prop() id2?: string
    model = new ConectorPrincipalResp()

    async mounted() {
      await this.model.findByQuery({ id1: this.id1 || 0, id2: this.id2 || 0 })
    }

    async persist() {
      await this.model.conectorPrincipal.validate()
      await this.model.conectorPrincipal.save()
      successAndPush('system.success.persist', '/listConectorPrincipal')
    }
  }
</script>

