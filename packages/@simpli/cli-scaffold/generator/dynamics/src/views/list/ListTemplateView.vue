<template>
  <div class="verti">
    <adap-header :collection="collection"
                 :title="$t('classes.<%-model.name%>.title')"
                 persistUrl="/persist<%-model.name%>"
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
import {<%-model.name%>, PagedResp} from '@/model'
import {pushByName} from '@/simpli'

@Component
export default class List<%-model.name%>View extends Vue {
  collection = new PagedResp(<%-model.name%>)
  toRemove = new <%-model.name%>()

  async mounted() {
    await this.collection.search()
  }

  async removeItem() {
    await this.toRemove.remove()
    this.resetRemove()
    await this.collection.search()
  }

  openPersist(item: <%-model.name%>) {
    pushByName('persist<%-model.name%>', item.$id)
  }

  openRemoveModal(item: <%-model.name%>) {
    this.toRemove = item
  }

  resetRemove() {
    this.toRemove = new <%-model.name%>()
  }
}
</script>
