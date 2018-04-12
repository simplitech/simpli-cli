<template>
  <div class="verti">
    <adap-header :collection="collection"
                 :title="$t('classes.Tag.title')"
                 persistUrl="/persistTag"
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
  import Tag from '@/model/Tag'
  import PagedResp from '@/model/response/PagedResp'
  import {pushByName} from '@/simpli'

  @Component
  export default class ListTagView extends Vue {
    collection = new PagedResp(Tag)
    toRemove = new Tag()

    async mounted() {
      await this.collection.search()
    }

    async removeItem() {
      await this.toRemove.remove()
      this.resetRemove()
      await this.collection.search()
    }

    openPersist(item: Tag) {
      pushByName('persistTag', item.$id)
    }

    openRemoveModal(item: Tag) {
      this.toRemove = item
    }

    resetRemove() {
      this.toRemove = new Tag()
    }
  }
</script>
