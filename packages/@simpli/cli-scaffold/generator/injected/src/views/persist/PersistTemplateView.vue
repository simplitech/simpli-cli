<template>
<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
  <div class="verti">
    <section class="header">
      <h1 class="m-0">
        {{ $t('classes.<%-origin.name%>.title') }}
      </h1>
    </section>

    <section class="container fluid">
      <await init name="find<%-origin.name%>Resp" class="my-20">
        <form class="elevated padded" @submit.prevent="$await.run(persist, 'persist')">

          <div v-for="(schemaRow, field) in model.<%-model.resp.originAttr%>.$schema" :key="field">
<%_ if (model.arrayAtrrs.length) { _%>
            <resource-input v-model="model.<%-model.resp.originAttr%>" :field="field" :selectItems="resource[field]"/>
<%_ } else { _%>
            <resource-input v-model="model.<%-model.resp.originAttr%>" :field="field"/>
<%_ } _%>
          </div>

          <hr>

          <await name="persist" class="items-center">
            <button type="submit" class="primary">{{ $t('persist.submit') }}</button>
          </await>

        </form>
      </await>
    </section>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator'
  <%-model.injectIntoDependence().build()%>
  import {$, successAndPush} from '@/simpli'

  @Component
  export default class Persist<%-origin.name%>View extends Vue {
    @Prop({type: [String, Number]}) id?: string
    model = new <%-model.name%>()

<%_ if (model.arrayAtrrs.length) { _%>
    get resource() {
      return {
<%-model.buildPersistRespResourceGetter(origin)%>
      }
    }

<%_ } _%>
    async mounted() {
      await this.model.find(this.id || 0)
    }

    async persist() {
      await this.model.<%-model.resp.originAttr%>.validate()
      await this.model.<%-model.resp.originAttr%>.save()
      successAndPush('system.success.persist', '/<%-kebabCase(origin.name)%>/list')
    }
  }
</script>
