<template>
<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
  <div class="verti">
    <adap-header
      :collection="collection"
      :title="$t('classes.<%-model.name%>.title')"
      persistUrl="/<%-kebabCase(model.name)%>/new"
      hasSearch hasCsv
    />

    <section>
      <adap-table :collection="collection">
        <div slot="options" slot-scope="props">
          <a @click="openPersist(props.item)" class="icon icon-pencil"></a>
<%_ if (model.resource.deletable) { _%>
          <a @click="openRemoveModal(props.item)" class="icon icon-trash"></a>
<%_ } _%>
        </div>
      </adap-table>
    </section>
<%_ if (model.resource.deletable) { _%>

    <modal-remove
      :active="!!toRemove.$id"
      :text="toRemove.nome"
      @cancel="resetRemove"
      @confirm="removeItem"
    />
<%_ } _%>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  <%-model.injectIntoDependence().build()%>
  import PagedResp from '@/model/collection/PagedResp'
  import {pushByName} from '@/simpli'

  @Component
  export default class List<%-model.name%>View extends Vue {
    collection = new PagedResp(<%-model.name%>)
<%_ if (model.resource.deletable) { _%>
    toRemove = new <%-model.name%>()
<%_ } _%>

    openPersist(item: <%-model.name%>) {
      pushByName('edit<%-model.name%>', item.$id)
    }
<%_ if (model.resource.deletable) { _%>

    async removeItem() {
      await this.toRemove.remove()
      this.resetRemove()
      await this.collection.search()
    }

    openRemoveModal(item: <%-model.name%>) {
      this.toRemove = item
    }

    resetRemove() {
      this.toRemove = new <%-model.name%>()
    }
<%_ } _%>  }
</script>
