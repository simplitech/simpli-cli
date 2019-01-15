<template>
<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
  <div class="verti">
    <section class="header">
      <div class="horiz items-center gutter-10">
        <h1 class="m-0">
          {{$t('classes.<%-model.name%>.title')}}
        </h1>

        <adap-searchfield :collection="collection" :placeholder="$t('app.search')"/>

        <await name="query<%-model.name%>"></await>

        <div class="weight-1"></div>

        <span v-if="collection.items.length">
          {{ $t('app.totalLines', {total: collection.total}) }}
        </span>

        <await name="downloadCsv">
          <button @click="downloadCsv">
            {{ $t('app.downloadCsv') }}
          </button>
        </await>

        <router-link to="/<%-kebabCase(model.name)%>/new" class="btn primary">
          {{ $t('app.add') }}
        </router-link>
      </div>
    </section>

    <section>
      <await init name="query" effect="fade-up" spinner="MoonLoader" spinnerPadding="20px">
        <template v-if="!collection.items.length">
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

                <th v-for="(value, key) in collection.header" :key="key">
                  <adap-orderby :collection="collection" :name="key" :label="value"/>
                </th>
              </tr>
              </thead>

              <tbody>
              <tr v-for="(item, i) in collection.items" :key="i">
                <td class="horiz nowrap">
                  <a @click="pushByName('edit<%-model.name%>', item.$id)" class="icon icon-pencil"></a>
<%_ if (model.resource.deletable) { _%>
                  <a @click="openRemoveModal(item)" class="icon icon-trash"></a>
<%_ } _%>
                </td>

                <td v-for="(field, j) in item.fieldsToRender" :key="j">
                  <resource-render v-model="collection.items[i]" :field="field"/>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <adap-pagination :collection="collection"/>
        </template>
      </await>
    </section>
<%_ if (model.resource.deletable) { _%>

    <modal-remove name="modalRemove" :text="toRemove.$tag" @cancel="closeRemoveModal" @confirm="removeItem"/>
<%_ } _%>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Watch, Mixins, Vue} from 'vue-property-decorator'
  <%-model.injectIntoDependence().build()%>
  import PagedResp from '@/model/collection/PagedResp'
  import {$, MixinQueryRouter, pushByName} from '@/simpli'

  @Component({
    mixins: [MixinQueryRouter],
  })
  export default class List<%-model.name%>View extends Mixins<MixinQueryRouter>() {
    collection = new PagedResp(<%-model.name%>)
<%_ if (model.resource.deletable) { _%>
    toRemove = new <%-model.name%>()
<%_ } _%>
    pushByName = pushByName

<%_ if (model.resource.deletable) { _%>
    async removeItem() {
      await this.toRemove.remove()
      this.closeRemoveModal()
      await this.collection.search()
    }

    openRemoveModal(item: <%-model.name%>) {
      this.toRemove = item
      $.modal.open('modalRemove')
    }

    closeRemoveModal() {
      this.toRemove = new <%-model.name%>()
      $.modal.close('modalRemove')
    }

<%_ } _%>
    async downloadCsv() {
      const csv = new PagedResp(<%-model.name%>, {}, null, null)

      const fetch = async () => await csv.search()
      await $.await.run(fetch, 'downloadCsv')

      csv.downloadCsv()
    }

    async mounted() {
      await this.query()
    }
  }
</script>
