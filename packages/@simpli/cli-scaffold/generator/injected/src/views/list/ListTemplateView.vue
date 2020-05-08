<template>
<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
  <div class="view">
    <header class="header">
      <h1 class="header__title">
        {{$t('resource.<%-model.name%>')}}
      </h1>

      <div class="header__items">
        <adap-searchfield :collection="collection" :placeholder="$t('app.search')" class="input h-8"/>

        <filter-toggle v-model="filterOpen" />

<%_ if (model.listApi) { _%>
        <await name="<%-model.listApi.name%>" :spinnerScale="0.8" class="w-12" />
<%_ } else { _%>
        <await name="list" :spinnerScale="0.8" class="w-12" />
<%_ } _%>

        <div class="weight-1"></div>

        <span v-if="!collection.isEmpty()">
          {{ $t('app.totalLines', {total: collection.total}) }}
        </span>

<%_ if (model.listCsvApi) { _%>
        <await name="<%-model.listCsvApi.name%>" :spinnerScale="0.8">
          <button @click="downloadXlsx" class="btn btn--solid">
            {{ $t('app.downloadXlsx') }}
          </button>
        </await>

<%_ } _%>
        <router-link to="/<%-kebabCase(model.name)%>/new" class="btn btn--contrast bg-secondary">
          {{ $t('app.add') }}
        </router-link>
      </div>

      <transition-expand>
        <div v-show="filterOpen" class="z-10">
          <filter-<%-kebabCase(model.name)%> :collection="collection" />
        </div>
      </transition-expand>
    </header>

    <section>
      <await
              name="hardQuery"
              class="relative verti items-center"
              effect="fade-up"
              spinner="MoonLoader"
              spinnerPadding="20px"
      >
        <template v-if="collection.isEmpty()">
          <div class="mt-10 uppercase text-center text-black-600 text-lg font-light">
            {{ $t('app.noDataToShow') }}
          </div>
        </template>

        <template v-else>
          <div class="w-full overflow-x-auto">
            <table class="table">
              <thead>
              <tr>
                <th />

                <th v-for="(value, key) in schema.header" :key="key">
                  <adap-orderby :collection="collection" :name="key" :label="value"/>
                </th>
              </tr>
              </thead>

              <tbody>
              <tr v-for="(item, i) in collection.items" :key="item.$id">
                <td>
                  <div class="horiz children:mx-1">
                    <a @click="goToPersistView(item)" class="btn btn--flat btn--icon">
                      <i class="far fa-edit"/>
                    </a>
<%_ if (model.resource.deletable) { _%>
                    <a @click="removeItem(item)" class="btn btn--flat btn--icon">
                      <i class="far fa-trash-alt"/>
                    </a>
<%_ } _%>
                  </div>
                </td>

                <td v-for="field in schema.allFields" :key="field">
                  <render-schema
                    v-model="collection.items[i]"
                    :schema="schema"
                    :field="field"
                  />
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <div class="fixed z-10 bottom-4">
            <adap-pagination :collection="collection" class="m-auto"/>
          </div>
        </template>

        <await name="softQuery" class="z-20 await__spinner--screen-light" />
      </await>
    </section>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Watch, Mixins} from 'vue-property-decorator'
  import {MixinRouteMatch} from '@/components/mixins/MixinRouteMatch'
  import FilterToggle from '@/components/FilterToggle.vue'
  import Filter<%-model.name%> from '@/components/filters/Filter<%-model.name%>.vue'
  <%-model.injectIntoDependence().build()%>
  <%-model.injectCollectionIntoDependence().build()%>
  <%-model.injectSchemaIntoDependence('List').build()%>
  <%-model.injectSchemaIntoDependence('Export').build()%>

  @Component({
    components: {FilterToggle, Filter<%-model.name%>},
  })
  export default class List<%-model.name%>View extends Mixins(MixinRouteMatch) {
    schema = new List<%-model.name%>Schema()
    collection = new <%-model.name%>Collection()
    filterOpen = false

    async created() {
      if (this.hasQueryParams) {
        this.updateObjectFromRoute(this.collection)
      }
      await this.$await.run('hardQuery', () => this.collection.queryAsPage())
    }

    @Watch('collection', {deep: true})
    collectionEvent() {
      this.updateRouteFromObject(this.collection)
    }

    goToPersistView(item: <%-model.name%>) {
      this.$nav.pushByName('edit<%-model.name%>', <%-model.implodeResourceIds('item')%>)
    }
<%_ if (model.resource.deletable) { _%>

    async removeItem(item: <%-model.name%>) {
<%_ if (model.removeApi) { _%>
      await this.$dialog.remove(item)
      await item.<%-model.removeApi.name%>()
<%_ } else { _%>
      // TODO: define the remove method
      // await new DialogRemove(item).confirm(() => item.remove<%-model.name%>())
<%_ } _%>
      await this.collection.queryAsPage()
    }
<%_ } _%>
<%_ if (model.listCsvApi) { _%>

    async downloadXlsx() {
      const {ascending, orderBy, page, limit, ...params} = this.collection.params

      const coll = new <%-model.name%>Collection().clearFilters().addFilter(params)

      await coll.<%-model.listCsvApi.name%>()
      this.$xlsx.downloadFromSchema(coll.items, new Export<%-model.name%>Schema())
    }
<%_ } _%>
  }
</script>
