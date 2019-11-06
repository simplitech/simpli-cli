<template>
<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
  <div class="view">
    <header class="header">
      <h1 class="header__title">
        {{$t('resource.<%-model.name%>')}}
      </h1>

      <div class="header__items">
        <adap-searchfield :collection="collection" :placeholder="$t('app.search')" class="input h-8"/>

<%_ if (collection && collection.apis && collection.apis[0].name) { _%>
        <await name="<%-collection.apis[0].name%>" :spinnerScale="0.8"/>
<%_ } else { _%>
        <await name="list" :spinnerScale="0.8"/>
<%_ } _%>

        <div class="weight-1"></div>

        <span v-if="collection.size()">
          {{ $t('app.totalLines', {total: collection.total}) }}
        </span>

<%_ if (collection && collection.getApiByName('listCsv')) { _%>
        <await name="listCsv" :spinnerScale="0.8">
          <button @click="downloadCsv" class="btn btn--solid">
            {{ $t('app.downloadCsv') }}
          </button>
        </await>

<%_ } _%>
        <router-link to="/<%-kebabCase(model.name)%>/new" class="btn btn--contrast bg-secondary">
          {{ $t('app.add') }}
        </router-link>
      </div>
    </header>

    <section class="weight-1 h-full bg-black-100">
      <await init name="query" class="relative h-full verti items-center" effect="fade-up" spinner="MoonLoader" spinnerPadding="20px">
        <template v-if="!collection.size()">
          <div class="mt-10 uppercase text-center text-black-600 text-lg font-light">
            {{ $t('app.noDataToShow') }}
          </div>
        </template>

        <template v-else>
          <div class="weight-1 w-full overflow-auto bg-primary">
            <table class="table">
              <thead>
              <tr>
                <th></th>

                <th v-for="(value, key) in schema.header" :key="key">
                  <adap-orderby :collection="collection" :name="key" :label="value"/>
                </th>
              </tr>
              </thead>

              <tbody>
              <tr v-for="(item, i) in collection.all()" :key="i">
                <td>
                  <div class="grid grid-columns-2 grid-gap-1">
                    <a @click="Helper.pushByName('edit<%-model.name%>', <%-model.implodeResourceIds('item')%>)" class="btn btn--flat btn--icon icon icon-pencil mr-4"></a>
<%_ if (model.resource.deletable) { _%>
                    <a @click="openRemoveModal(item)" class="btn btn--flat btn--icon icon icon-trash"></a>
<%_ } _%>
                  </div>
                </td>

                <td v-for="(field, j) in schema.allFields" :key="j">
                  <render-schema v-model="collection.get(i)" :schema="schema" :field="field"/>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <div class="absolute bottom-4">
            <adap-pagination :collection="collection" class="m-auto"/>
          </div>
        </template>

        <await name="adapQuery" class="z-20 await__spinner--screen-light"/>
      </await>
    </section>
<%_ if (model.resource.deletable) { _%>

    <modal-remove v-model="toRemove" @confirm="removeItem"/>
<%_ } _%>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Watch, Mixins} from 'vue-property-decorator'
  import {$, Helper, MixinQueryRouter} from '@/simpli'
  <%-model.injectIntoDependence().build()%>
  <%-model.injectCollectionIntoDependence().build()%>
  <%-model.injectSchemaIntoDependence('List').build()%>
  <%-model.injectSchemaIntoDependence('Csv').build()%>

  @Component
  export default class List<%-model.name%>View extends Mixins(MixinQueryRouter) {
    Helper = Helper

    schema = new List<%-model.name%>Schema()
    collection = new <%-model.name%>Collection()

<%_ if (model.resource.deletable) { _%>
    toRemove: <%-model.name%> | null = null

<%_ } _%>
    async created() {
      await this.query()
    }
<%_ if (model.resource.deletable) { _%>

    openRemoveModal(item: <%-model.name%>) {
      this.toRemove = item
    }

    async removeItem() {
      if (this.toRemove) {
<%_ if (model.removeApi) { _%>
        await this.toRemove.<%-model.removeApi.name%>()
<%_ } else { _%>
        // TODO: define the remove method
        // await this.toRemove.remove()
<%_ } _%>
        this.toRemove = null
        await this.collection.list()
      }
    }
<%_ } _%>
<%_ if (collection && collection.getApiByName('listCsv')) { _%>

    async downloadCsv() {
      const {params} = this.collection
      delete params.ascending
      delete params.orderBy
      delete params.page
      delete params.limit

      const csv = new <%-model.name%>Collection()
        .clearFilters()
        .addFilter(params)

      await csv.listCsv()
      new Csv<%-model.name%>Schema().downloadCsv(csv.all())
    }
<%_ } _%>
  }
</script>
