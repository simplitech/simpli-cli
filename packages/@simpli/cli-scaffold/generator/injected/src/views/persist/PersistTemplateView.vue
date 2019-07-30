<template>
<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
  <div class="verti">
    <header class="header py-2 px-4">
      <h1 class="my-0 text-4xl font-semibold">
        {{ $t('resource.<%-model.name%>') }}
      </h1>
    </header>

    <section class="weight-1 h-0 bg-black-100">
<%_ if (model.populateApi) { _%>
      <await init name="<%-model.populateApi.name%>" class="w-full h-full px-4 py-8 overflow-auto">
<%_ } else { _%>
      <await init name="populate" class="w-full h-full px-4 py-8 overflow-auto">
<%_ } _%>
        <form class="container mx-auto p-3 md:p-8 bg-white shadow-md rounded-lg" @submit.prevent="persist">
          <div v-for="(field, i) in schema.allFields" :key="i">
            <render-schema v-model="<%-model.attrName%>" :schema="schema" :field="field" class="mb-4"/>
          </div>

<%_ if (model.persistApi) { _%>
          <await name="<%-model.persistApi.name%>" class="items-center-center">
<%_ } else { _%>
          <await name="persist" class="items-center-center">
<%_ } _%>
            <button type="submit" class="h-12 px-20 btn--contrast bg-primary">{{ $t('app.submit') }}</button>
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
  <%-model.injectSchemaIntoDependence('Input').build()%>

  @Component
  export default class Persist<%-model.name%>View extends Vue {
<%_ for (var i in model.resource.endpointParams) { var param = model.resource.endpointParams[i] _%>
    @Prop() <%-param%>?: string
<%_ } _%>

    schema = new Input<%-model.name%>Schema()
    <%-model.attrName%> = new <%-model.name%>()

    async mounted() {
<%_ if (model.resolvedPersistDependencies.length) { _%>
      this.schema.populateResource()
<%_ } _%>
      await this.populate()
    }

    async populate() {
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
