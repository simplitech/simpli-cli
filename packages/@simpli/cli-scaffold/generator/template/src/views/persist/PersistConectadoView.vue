<template>
  <div class="verti">
    <h1 class="header px-30 py-10 m-0">
      {{ $t("classes.Conectado.title") }}
    </h1>

    <section class="verti scroll weight-1 items-center-top p-30">
      <form @submit.prevent="persist" class="elevated w-full max-w-650 p-20">
        <input-group
                type="text"
                maxlength="45"
                v-model="model.conectado.titulo">
          {{ $t("classes.Conectado.columns.titulo") }}
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
  import ConectadoResp from '@/model/response/ConectadoResp'
  import {successAndPush} from '@/simpli'

  @Component
  export default class PersistConectadoView extends Vue {
    @Prop() id?: string
    model = new ConectadoResp()

    async mounted() {
      await this.model.find(this.id || 0)
    }

    async persist() {
      await this.model.conectado.validate()
      await this.model.conectado.save()
      successAndPush('system.success.persist', '/listConectado')
    }
  }
</script>
