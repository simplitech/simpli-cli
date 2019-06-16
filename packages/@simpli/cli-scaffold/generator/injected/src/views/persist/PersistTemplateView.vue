<template>
<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
  <div class="verti">
    <section class="header">
      <h1 class="m-0">
        {{ $t('resource.<%-model.name%>') }}
      </h1>
    </section>

    <section class="self-center max-w-600 w-full">
      <await init name="populate" class="m-20">
        <form class="elevated padded" @submit.prevent="persist">

          <div v-for="(field, i) in schema.allFields" :key="i">
<%_ if (model.objectAtrrs.length || model.arrayAtrrs.length) { _%>
            <render-schema v-model="<%-model.attrName%>" :schema="schema" :field="field" :items="resource[field]"/>
<%_ } else { _%>
            <render-schema v-model="<%-model.attrName%>" :schema="schema" :field="field"/>
<%_ } _%>
          </div>

          <hr>

          <await name="persist" class="items-center">
            <button type="submit" class="primary">{{ $t('app.submit') }}</button>
          </await>

        </form>
      </await>
    </section>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator'
  import {$, Helper} from '@/simpli'
  <%-model.injectIntoDependence().build()%>
<%_ for (var i in model.resolvedPersistDependencies) { var dependence = model.resolvedPersistDependencies[i] _%>
  <%-dependence.buildAsCollection()%>
<%_ } _%>
  <%-model.injectSchemaIntoDependence('Input').build()%>

  @Component
  export default class Persist<%-model.name%>View extends Vue {
<%_ for (var i in model.resource.endpointParams) { var param = model.resource.endpointParams[i] _%>
    @Prop() <%-param%>?: string
<%_ } _%>

    schema = new Input<%-model.name%>Schema()
    <%-model.attrName%> = new <%-model.name%>()

<%_ if (model.resolvedPersistDependencies.length) { _%>
<%-model.buildPersistResourceInstances()%>
    get resource() {
      return {
<%-model.buildPersistResource()%>
      }
    }

<%_ } _%>
    async mounted() {
<%_ for (var i in model.resolvedPersistDependencies) { var dependence = model.resolvedPersistDependencies[i] _%>
      await this.collection<%-dependence.children[0]%>.list()
<%_ } _%>
<%_ if (model.resolvedPersistDependencies.length) { _%>

<%_ } _%>
<%_ for (var i in model.resource.endpointParams) { var param = model.resource.endpointParams[i] _%>
      const <%-param%> = Number(this.<%-param%>) || null
<%_ } _%>
      if (<%-model.resource.endpointParamsIfImploded%>) {
        await this.<%-model.attrName%>.populate(<%-model.resource.endpointParamsMethodImploded%>)
      }

      $.await.done('populate')
    }

    async persist() {
      this.schema.validate(this.<%-model.attrName%>)
      await this.<%-model.attrName%>.persist()
      Helper.successAndPush('system.success.persist', '/<%-kebabCase(model.name)%>/list')
    }
  }
</script>
