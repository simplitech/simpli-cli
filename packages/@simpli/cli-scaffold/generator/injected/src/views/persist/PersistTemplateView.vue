<template>
<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
  <div class="view">
    <header class="header">
      <h1 class="header__title mb-1">
        {{ $t('resource.<%-model.name%>') }}
      </h1>
    </header>

    <section class="relative weight-1 bg-black-100">
<%_ if (model.populateApi) { _%>
      <await name="<%-model.populateApi.name%>" class="absolute inset-0 px-4 py-8 overflow-y-auto">
<%_ } else { _%>
      <await name="populate" class="absolute inset-0 px-4 py-8 overflow-y-auto">
<%_ } _%>
        <form class="container card" @submit.prevent="persist">
          <div class="mb-8 grid grid-columns lg:grid-columns-2 grid-gap-4">
            <render-schema
                    v-for="field in schema.allFields"
                    v-model="<%-model.attrName%>"
                    :schema="schema"
                    :field="field"
                    :key="field"
            />
          </div>

<%_ if (model.persistApi) { _%>
          <await name="<%-model.persistApi.name%>" class="items-center-center">
<%_ } else { _%>
          <await name="persist" class="items-center-center">
<%_ } _%>
            <button type="submit" class="h-12 px-20 btn btn--contrast bg-secondary">
              {{ $t('app.submit') }}
            </button>
          </await>
        </form>
      </await>
    </section>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Watch, Provide, Vue} from 'vue-property-decorator'
  import {$, Helper} from '@/simpli'
  <%-model.injectIntoDependence().build()%>
  <%-model.injectSchemaIntoDependence('Input').build()%>

  @Component
  export default class Persist<%-model.name%>View extends Vue {
<%_ for (var i in model.resource.endpointParams) { var param = model.resource.endpointParams[i] _%>
    @Prop() <%-param%>?: string
<%_ } _%>

    @Provide('validator') validator = this.$validator

    schema = new Input<%-model.name%>Schema()
    <%-model.attrName%> = new <%-model.name%>()

    async created() {
<%_ if (model.resolvedPersistDependencies.length) { _%>
      this.populateResource()
<%_ } _%>
      await this.populate()
    }
<%_ if (model.resolvedPersistDependencies.length) { _%>

    populateResource() {
  <%_ for (var i in model.resolvedPersistDependencies) { var dependence = model.resolvedPersistDependencies[i] _%>
      this.schema.collection<%-dependence.children[0]%>.list()
  <%_ } _%>
    }
  <%_ } _%>

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
      const isValid = await this.validator.validateAll()

      if (!isValid) {
        Helper.abort('system.error.validation')
      }

<%_ if (model.persistApi) { _%>
      await this.<%-model.attrName%>.<%-model.persistApi.name%>()
<%_ } else { _%>
      // TODO: define the persist method
      // await this.<%-model.attrName%>.persist()
<%_ } _%>
      await Helper.successAndPush('system.success.persist', '/<%-kebabCase(model.name)%>/list')
    }
  }
</script>
