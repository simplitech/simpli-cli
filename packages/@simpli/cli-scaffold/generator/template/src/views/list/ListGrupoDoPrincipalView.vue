<template>
  <div class="verti">
    <adap-header :collection="collection"
                 :title="$t('classes.GrupoDoPrincipal.title')"
                 persistUrl="/persistGrupoDoPrincipal"
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
  import GrupoDoPrincipal from '@/model/GrupoDoPrincipal'
  import PagedResp from '@/model/response/PagedResp'
  import {pushByName} from '@/simpli'

  @Component
  export default class ListGrupoDoPrincipalView extends Vue {
    collection = new PagedResp(GrupoDoPrincipal)
    toRemove = new GrupoDoPrincipal()

    async mounted() {
      await this.collection.search()
    }

    async removeItem() {
      await this.toRemove.remove()
      this.resetRemove()
      await this.collection.search()
    }

    openPersist(item: GrupoDoPrincipal) {
      pushByName('persistGrupoDoPrincipal' , item.$id)
    }

    openRemoveModal(item: GrupoDoPrincipal) {
      this.toRemove = item
    }

    resetRemove() {
      this.toRemove = new GrupoDoPrincipal()
    }
  }
</script>
