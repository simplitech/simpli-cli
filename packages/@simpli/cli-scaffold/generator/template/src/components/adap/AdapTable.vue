<template>
  <div class="p-20">
    <template v-if="!collection.items.length">
      <p class="text-center">
        {{ $t("app.noDataToShow") }}
      </p>
    </template>

    <template v-else>
      <div class="elevated p-0 x-scroll">
        <table class="animated fadeIn">
          <thead>
          <tr>
            <th></th>

            <th v-for="(value, key) in collection.headers" :key="key">
              <adap-orderby :collection="collection" :name="key">
                {{ value }}
              </adap-orderby>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, i) in collection.items">
            <td>
              <slot name="options" :item="item" :i="i"></slot>
            </td>

            <td v-for="value in collection.values(i)" v-html="value"></td>
          </tr>
          </tbody>
        </table>
      </div>

      <adap-pagination :collection="collection"></adap-pagination>
    </template>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import PageCollection from '@/app/http/PageCollection'
import {Resource} from '@/app/http/Resource'

@Component
export default class AdapTable extends Vue {
  @Prop({required: true}) collection?: PageCollection<Resource>
}
</script>
