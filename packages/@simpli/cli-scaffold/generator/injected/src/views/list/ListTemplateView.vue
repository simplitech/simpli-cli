<template>
<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
  <div class="verti">
    <section class="header">
      <div class="horiz items-center gutter-10">
        <h1 class="m-0">
          {{$t('resource.<%-model.name%>')}}
        </h1>

        <adap-searchfield :collection="collection" :placeholder="$t('app.search')"/>

<%_ if (collection && collection.apis && collection.apis[0].name) { _%>
        <await name="<%-collection.apis[0].name%>"/>
<%_ } else { _%>
        <await name="list"/>
<%_ } _%>

        <div class="weight-1"></div>

        <span v-if="collection.size()">
          {{ $t('app.totalLines', {total: collection.total}) }}
        </span>

<%_ if (collection && collection.getApiByName('listCsv')) { _%>
        <await name="listCsv">
          <button @click="downloadCsv">
            {{ $t('app.downloadCsv') }}
          </button>
        </await>

<%_ } _%>
        <router-link to="/<%-kebabCase(model.name)%>/new" class="btn primary">
          {{ $t('app.add') }}
        </router-link>
      </div>
    </section>

    <section>
      <await init name="query" class="rel h-full" effect="fade-up" spinner="MoonLoader" spinnerPadding="20px">
        <template v-if="!collection.size()">
          <h3 class="p-20 text-center">
            {{ $t('app.noDataToShow') }}
          </h3>
        </template>

        <template v-else>
          <div class="elevated square intense x-scroll">
            <table>
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
                <td class="horiz nowrap">
                  <a @click="Helper.pushByName('edit<%-model.name%>', <%-model.implodeResourceIds('item')%>)" class="icon icon-pencil"></a>
<%_ if (model.resource.deletable) { _%>
                  <a @click="openRemoveModal(item)" class="icon icon-trash"></a>
<%_ } _%>
                </td>

                <td v-for="(field, j) in schema.allFields" :key="j">
                  <render-schema v-model="collection.get(i)" :schema="schema" :field="field"/>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <adap-pagination :collection="collection"/>
        </template>

        <await name="adapQuery" class="await-screen"/>
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
    async mounted() {
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
      const csv = new <%-model.name%>Collection().whole()
      await csv.listCsv()
      new Csv<%-model.name%>Schema().downloadCsv(csv.all())
    }
<%_ } _%>
  }
</script>
