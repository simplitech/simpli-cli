<template>
  <div class="verti">
    <adap-header :collection="collection"
                 :title="$t('classes.Principal.title')"
                 persistUrl="/persistPrincipal"
                 hasSearch hasCsv/>

    <section>
      <adap-table :collection="collection">
        <div slot="options" slot-scope="props">
          <a @click="openPersist(props.item)" class="icon icon-pencil"></a>
          <a @click="openRemoveModal(props.item)" class="icon icon-trash"></a>
        </div>
      </adap-table>
    </section>

    <modal-remove :active="!!toRemove.$id"
                  :text="toRemove.nome"
                  @cancel="resetRemove"
                  @confirm="removeItem"/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import Principal from '@/model/Principal'
import PagedResp from '@/model/response/PagedResp'
import {pushByName} from '@/simpli'

@Component
export default class ListPrincipalView extends Vue {
  collection = new PagedResp(Principal)
  toRemove = new Principal()

  async mounted() {
    await this.collection.search()
  }

  async removeItem() {
    await this.toRemove.remove()
    this.resetRemove()
    await this.collection.search()
  }

  openPersist(item: Principal) {
    pushByName('persistPrincipal', item.$id)
  }

  openRemoveModal(item: Principal) {
    this.toRemove = item
  }

  resetRemove() {
    this.toRemove = new Principal()
  }
}
</script>
