<template>
  <div class="verti">
    <adap-header :collection="collection"
                 :title="$t('classes.ConectorPrincipal.title')"
                 persistUrl="/persistConectorPrincipal"
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
  import ConectorPrincipal from '@/model/ConectorPrincipal'
  import PagedResp from '@/model/response/PagedResp'
  import {pushByName} from '@/simpli'

  @Component
  export default class ListConectorPrincipalView extends Vue {
    collection = new PagedResp(ConectorPrincipal)
    toRemove = new ConectorPrincipal()

    async mounted() {
      await this.collection.search()
    }

    async removeItem() {
      await this.toRemove.remove()
      this.resetRemove()
      await this.collection.search()
    }

    openPersist(item: ConectorPrincipal) {
      pushByName('persistConectorPrincipal', item.$id, item.$secondaryId)
    }

    openRemoveModal(item: ConectorPrincipal) {
      this.toRemove = item
    }

    resetRemove() {
      this.toRemove = new ConectorPrincipal()
    }
  }
</script>
