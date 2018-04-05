<template>
  <div class="verti">
    <adap-header :collection="collection"
                 :title="$t('classes.ItemDoPrincipal.title')"
                 :persistUrl="$uri.persistItemDoPrincipal()"
                 hasSearch hasCsv/>

    <section>
      <adap-table :collection="collection">
        <div slot="options" slot-scope="props">
          <a @click="openPersist(props.item)" class="icon icon-pencil"></a>
        </div>
      </adap-table>
    </section>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import ItemDoPrincipal from '@/model/ItemDoPrincipal'
  import PagedResp from '@/model/response/PagedResp'
  import {uri, push} from '@/helpers'

  @Component
  export default class ListItemDoPrincipalView extends Vue {
    collection: PagedResp<ItemDoPrincipal> = new PagedResp(ItemDoPrincipal)
    toRemove: ItemDoPrincipal = new ItemDoPrincipal()

    async mounted() {
      await this.collection.search()
    }

    async removeItem() {
      await this.toRemove.remove()
      this.resetRemove()
      await this.collection.search()
    }

    openPersist(item: ItemDoPrincipal) {
      push(uri.persistItemDoPrincipal(item.$id))
    }

    openRemoveModal(item: ItemDoPrincipal) {
      this.toRemove = item
    }

    resetRemove() {
      this.toRemove = new ItemDoPrincipal()
    }
  }
</script>
