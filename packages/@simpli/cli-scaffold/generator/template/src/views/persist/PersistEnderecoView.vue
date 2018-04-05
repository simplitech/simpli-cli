<template>

  <div class="verti">
    <h1 class="header px-30 py-10 m-0">
      {{ $t("classes.Endereco.title") }}
    </h1>

    <section class="verti scroll weight-1 items-center-top p-30">

      <form @submit.prevent="persist" class="elevated w-full max-w-650 p-20">
        <input-group
                type="cep"
                maxlength="45"
                v-model="model.endereco.cep">
          {{ $t("classes.Endereco.columns.cep") }}
        </input-group>

        <input-group
                type="text"
                maxlength="45"
                v-model="model.endereco.zipcode">
          {{ $t("classes.Endereco.columns.zipcode") }}
        </input-group>

        <input-group
                type="text"
                maxlength="45"
                v-model="model.endereco.rua">
          {{ $t("classes.Endereco.columns.rua") }}
        </input-group>

        <input-group
                type="number"
                step="1"
                v-model="model.endereco.nro"
                :placeholder="$t('persist.number')">
          {{ $t("classes.Endereco.columns.nro") }}
        </input-group>

        <input-group
                type="text"
                maxlength="45"
                v-model="model.endereco.cidade">
          {{ $t("classes.Endereco.columns.cidade") }}
        </input-group>

        <input-group
                type="text"
                maxlength="45"
                v-model="model.endereco.uf">
          {{ $t("classes.Endereco.columns.uf") }}
        </input-group>

        <input-group
                type="number"
                step="any"
                v-model="model.endereco.latitude"
                :placeholder="$t('persist.number')">
          {{ $t("classes.Endereco.columns.latitude") }}
        </input-group>

        <input-group
                type="number"
                step="any"
                v-model="model.endereco.longitude"
                :placeholder="$t('persist.number')">
          {{ $t("classes.Endereco.columns.longitude") }}
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
  import EnderecoResp from '@/model/response/EnderecoResp'
  import {successAndPush, uri, encrypt} from '@/helpers'

  @Component
  export default class PersistEnderecoView extends Vue {
    @Prop() id?: string
    model: EnderecoResp = new EnderecoResp()

    async mounted() {
      await this.model.find(this.id || 0)
    }

    async persist() {
      await this.model.endereco.validate()
      await this.model.endereco.save()
      successAndPush('system.success.persist', uri.listEndereco)
    }
  }
</script>
