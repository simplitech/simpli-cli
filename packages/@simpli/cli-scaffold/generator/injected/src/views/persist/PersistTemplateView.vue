<template>
<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
  <div class="verti">
    <section class="header">
      <h1 class="m-0">
        {{ $t('resource.<%-model.name%>') }}
      </h1>
    </section>

    <section class="self-center max-w-600 w-full">
<%_ if (model.populateApi) { _%>
      <await init name="<%-model.populateApi.name%>" class="m-20">
<%_ } else { _%>
      <await init name="populate" class="m-20">
<%_ } _%>
        <form class="elevated padded" @submit.prevent="persist">

          <div v-for="(field, i) in schema.allFields" :key="i">
<%_ if (model.objectAtrrs.length || model.arrayAtrrs.length) { _%>
            <render-schema v-model="<%-model.attrName%>" :schema="schema" :field="field" :items="resource[field]"/>
<%_ } else { _%>
            <render-schema v-model="<%-model.attrName%>" :schema="schema" :field="field"/>
<%_ } _%>
          </div>

          <hr>

<%_ if (model.persistApi) { _%>
          <await name="<%-model.persistApi.name%>" class="items-center">
<%_ } else { _%>
          <await name="persist" class="items-center">
<%_ } _%>
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
<%_ if (model.populateApi) { _%>
        await this.<%-model.attrName%>.<%-model.populateApi.name%>(<%-model.resource.endpointParamsMethodImploded%>)
<%_ } else { _%>
        // TODO: define the populate method
        // await this.<%-model.attrName%>.populate(<%-model.resource.endpointParamsMethodImploded%>)
<%_ } _%>
      }

<%_ if (model.populateApi) { _%>
      $.await.done('<%-model.populateApi.name%>')
<%_ } else { _%>
      $.await.done('populate')
<%_ } _%>
    }

    async persist() {
      this.schema.validate(this.<%-model.attrName%>)
<%_ if (model.persistApi) { _%>
      await this.<%-model.attrName%>.<%-model.persistApi.name%>()
<%_ } else { _%>
      // TODO: define the persist method
      // await this.<%-model.attrName%>.persist()
<%_ } _%>
      Helper.successAndPush('system.success.persist', '/<%-kebabCase(model.name)%>/list')
    }
  }
</script>
