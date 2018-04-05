<template>
  <div class="header horiz items-left-center gutter-10 px-30 py-10">
    <h1 class="m-0">
      {{title}}
    </h1>

    <adap-searchfield v-if="hasSearch"
                      :collection="collection"
                      :placeholder="$t('app.search')"
                      class="search w-200 ml-10"/>

    <div class="weight-1"></div>

    <small v-if="collection.items.length">
      {{ $t("app.totalLines", {total: collection.total}) }}
    </small>

    <button v-if="hasCsv" @click="downloadCsv">
      {{ $t("app.downloadCsv") }}
    </button>

    <router-link v-if="persistUrl"
                 :to="persistUrl"
                 class="btn accent">
      {{ $t("app.add") }}
    </router-link>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import PageCollection from '@/app/http/PageCollection'
import {Resource} from '@/app/http/Resource'
import PagedResp from '@/model/response/PagedResp'

@Component
export default class AdapHeader extends Vue {
  @Prop({required: true}) collection?: PageCollection<Resource>
  @Prop({default: ''}) title?: string
  @Prop({default: ''}) persistUrl?: string
  @Prop({default: false}) hasSearch?: boolean
  @Prop({default: false}) hasCsv?: boolean

  async downloadCsv() {
    const type = this.collection!.type
    const csv: PagedResp<typeof type> = new PagedResp(type)
    csv.clone(this.collection)
    csv.currentPage = undefined
    csv.perPage = undefined

    await csv.search()
    csv.downloadCsv()
  }
}
</script>
