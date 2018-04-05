<template>
  <div class="verti">
    <adap-header :collection="collection"
                 :title="$t('classes.Tag.title')"
                 :persistUrl="$uri.persistTag()"
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
  import {uri, push} from '@/helpers'

  @Component
  export default class ListTagView extends Vue {
    collection: PagedResp<Tag> = new PagedResp(Tag)
    toRemove: Tag = new Tag()

    async mounted() {
      await this.collection.search()
    }

    async removeItem() {
      await this.toRemove.remove()
      this.resetRemove()
      await this.collection.search()
    }

    openPersist(item: Tag) {
      push(uri.persistTag(item.$id))
    }

    openRemoveModal(item: Tag) {
      this.toRemove = item
    }

    resetRemove() {
      this.toRemove = new Tag()
    }
  }
</script>
