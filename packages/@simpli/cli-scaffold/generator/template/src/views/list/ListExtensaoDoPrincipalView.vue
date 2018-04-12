<template>
  <div class="verti">
    <adap-header :collection="collection"
                 :title="$t('classes.ExtensaoDoPrincipal.title')"
                 persistUrl="/persistExtensaoDoPrincipal"
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
  import ExtensaoDoPrincipal from '@/model/ExtensaoDoPrincipal'
  import PagedResp from '@/model/response/PagedResp'
  import {pushByName} from '@/simpli'

  @Component
  export default class ListExtensaoDoPrincipalView extends Vue {
    collection = new PagedResp(ExtensaoDoPrincipal)
    toRemove = new ExtensaoDoPrincipal()

    async mounted() {
      await this.collection.search()
    }

    async removeItem() {
      await this.toRemove.remove()
      this.resetRemove()
      await this.collection.search()
    }

    openPersist(item: ExtensaoDoPrincipal) {
      pushByName('persistExtensaoDoPrincipal', item.$id)
    }

    openRemoveModal(item: ExtensaoDoPrincipal) {
      this.toRemove = item
    }

    resetRemove() {
      this.toRemove = new ExtensaoDoPrincipal()
    }
  }
</script>
