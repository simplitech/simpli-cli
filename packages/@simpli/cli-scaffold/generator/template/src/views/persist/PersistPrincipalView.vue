<template>
  <div class="verti">
    <h1 class="header px-30 py-10 m-0">
      {{ $t("classes.Principal.title") }}
    </h1>

    <section class="verti scroll weight-1 items-center-top p-30">

      <form @submit.prevent="persist" class="elevated w-full max-w-650 p-20">

        <multiselect-group v-model="model.principal.grupoDoPrincipal"
                           :items="model.allGrupoDoPrincipal"
                           required
        >
          {{ $t("classes.Principal.columns.grupoDoPrincipal") }}
        </multiselect-group>

        <multiselect-group v-model="model.principal.grupoDoPrincipalFacultativo"
                           :items="model.allGrupoDoPrincipal"
        >
          {{ $t("classes.Principal.columns.grupoDoPrincipal") }}
        </multiselect-group>

        <input-group required
                     type="text"
                     maxlength="160"
                     v-model="model.principal.textoObrigatorio">
          {{ $t("classes.Principal.columns.textoObrigatorio") }}
        </input-group>

        <input-group
                type="text"
                maxlength="45"
                v-model="model.principal.textoFacultativo">
          {{ $t("classes.Principal.columns.textoFacultativo") }}
        </input-group>

        <input-group required
                     type="number"
                     step="any"
                     v-model="model.principal.decimalObrigatorio"
                     :placeholder="$t('persist.number')">
          {{ $t("classes.Principal.columns.decimalObrigatorio") }}
        </input-group>

        <input-group
                type="number"
                step="any"
                v-model="model.principal.decimalFacultativo"
                :placeholder="$t('persist.number')">
          {{ $t("classes.Principal.columns.decimalFacultativo") }}
        </input-group>

        <input-group required
                     type="number"
                     step="1"
                     v-model="model.principal.inteiroObrigatorio"
                     :placeholder="$t('persist.number')">
          {{ $t("classes.Principal.columns.inteiroObrigatorio") }}
        </input-group>

        <input-group
                type="number"
                step="1"
                v-model="model.principal.inteiroFacultativo"
                :placeholder="$t('persist.number')">
          {{ $t("classes.Principal.columns.inteiroFacultativo") }}
        </input-group>

        <checkbox-group v-model="model.principal.booleanoObrigatorio">
          {{ $t("classes.Principal.columns.booleanoObrigatorio") }}
        </checkbox-group>

        <checkbox-group v-model="model.principal.booleanoFacultativo">
          {{ $t("classes.Principal.columns.booleanoFacultativo") }}
        </checkbox-group>

        <input-group required
                     type="date"
                     v-model="model.principal.dataObrigatoria"
                     :placeholder="$t('dateFormat.date')">
          {{ $t("classes.Principal.columns.dataObrigatoria") }}
        </input-group>

        <input-group
                type="date"
                mask="'##/##/####'"
                v-model="model.principal.dataFacultativa"
                :placeholder="$t('dateFormat.date')">
          {{ $t("classes.Principal.columns.dataFacultativa") }}
        </input-group>

        <input-group required
                     type='datetime'
                     v-model="model.principal.datahoraObrigatoria"
                     :placeholder="$t('dateFormat.datetime')">
          {{ $t("classes.Principal.columns.datahoraObrigatoria") }}
        </input-group>

        <input-group
                type='datetime'
                v-model="model.principal.datahoraFacultativa"
                :placeholder="$t('dateFormat.datetime')">
          {{ $t("classes.Principal.columns.datahoraFacultativa") }}
        </input-group>

        <checkbox-group v-model="model.principal.ativo">
          {{ $t("classes.Principal.columns.ativo") }}
        </checkbox-group>

        <input-group
                type="email"
                maxlength="200"
                v-model="model.principal.email">
          {{ $t("classes.Principal.columns.email") }}
        </input-group>

        <input-group
                type="password"
                maxlength="200"
                v-model="model.principal.senha"
                :placeholder="model.principal.idPrincipalPk ? $t('app.onlyIfWantChangePassword') : ''">
          {{ $t("classes.Principal.columns.senha") }}
        </input-group>

        <input-group
                type="text"
                maxlength="200"
                v-model="model.principal.urlImagem">
          {{ $t("classes.Principal.columns.urlImagem") }}
        </input-group>

        <input-group
                type="text"
                maxlength="200"
                v-model="model.principal.url">
          {{ $t("classes.Principal.columns.url") }}
        </input-group>

        <input-group required
                     type="text"
                     maxlength="40"
                     v-model="model.principal.unico">
          {{ $t("classes.Principal.columns.unico") }}
        </input-group>

        <input-group
                type="text"
                maxlength="45"
                v-model="model.principal.nome">
          {{ $t("classes.Principal.columns.nome") }}
        </input-group>

        <input-group
                type="text"
                maxlength="45"
                v-model="model.principal.titulo">
          {{ $t("classes.Principal.columns.titulo") }}
        </input-group>

        <input-group
                type="cpf"
                maxlength="45"
                v-model="model.principal.cpf">
          {{ $t("classes.Principal.columns.cpf") }}
        </input-group>

        <input-group
                type="cnpj"
                maxlength="45"
                v-model="model.principal.cnpj">
          {{ $t("classes.Principal.columns.cnpj") }}
        </input-group>

        <input-group
                type="rg"
                maxlength="45"
                v-model="model.principal.rg">
          {{ $t("classes.Principal.columns.rg") }}
        </input-group>

        <input-group
                type="phone"
                maxlength="45"
                v-model="model.principal.celular">
          {{ $t("classes.Principal.columns.celular") }}
        </input-group>

        <textarea-group
                v-model="model.principal.textoGrande"
                rows="3">
          {{ $t("classes.Principal.columns.textoGrande") }}
        </textarea-group>

        <multiselect-group v-model="model.principal.tagPrincipal"
                           :items="model.allTag"
        >
          {{ $t("classes.TagPrincipal.title") }}
        </multiselect-group>

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
  import PrincipalResp from '@/model/response/PrincipalResp'
  import {successAndPush, uri, encrypt} from '@/helpers'

  @Component
  export default class PersistPrincipalView extends Vue {
    @Prop() id?: string
    model: PrincipalResp = new PrincipalResp()

    async mounted() {
      await this.model.find(this.id || 0)
    }

    async persist() {
      await this.model.principal.validate()
      await this.model.principal.save()
      successAndPush('system.success.persist', uri.listPrincipal)
    }
  }
</script>
