<template>
<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
  <div class="verti">
    <section class="header">
      <h1 class="m-0">
        {{ $t('classes.<%-model.name%>.title') }}
      </h1>
    </section>

    <section class="container small">
      <await init name="find<%-model.name%>" class="my-20">
        <form class="elevated padded" @submit.prevent="$await.run(persist, 'persist')">

          <div v-for="(field, i) in <%-model.attrName%>.fieldsToInput" :key="i">
<%_ if (model.arrayAtrrs.length) { _%>
            <resource-input v-model="<%-model.attrName%>" :field="field" :selectItems="resource[field]"/>
<%_ } else { _%>
            <resource-input v-model="<%-model.attrName%>" :field="field"/>
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
<%_ for (var i in model.resolvedPersistDependencies) { var dependence = model.resolvedPersistDependencies[i] _%>
  <%-dependence.build()%>
<%_ } _%>
  import {$, WholeCollection, successAndPush} from '@/simpli'

  @Component
  export default class Persist<%-model.name%>View extends Vue {
    @Prop({type: [String, Number]}) id?: string
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
      await this.all<%-dependence.children[0]%>.query()
<%_ } _%>
<%_ if (model.resolvedPersistDependencies.length) { _%>

<%_ } _%>
      if (this.id) await this.<%-model.attrName%>.find(this.id)
      $.await.done('find<%-model.name%>')
    }

    async persist() {
      await this.<%-model.attrName%>.validate()
      await this.<%-model.attrName%>.save()
      successAndPush('system.success.persist', '/<%-kebabCase(model.name)%>/list')
    }
  }
</script>
