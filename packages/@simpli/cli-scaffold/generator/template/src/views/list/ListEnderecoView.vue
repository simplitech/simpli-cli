<template>
  <div class="verti">
    <adap-header :collection="collection"
                 :title="$t('classes.Endereco.title')"
                 :persistUrl="$uri.persistEndereco()"
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
  import Endereco from '@/model/Endereco'
  import PagedResp from '@/model/response/PagedResp'
  import {uri, push} from '@/helpers'

  @Component
  export default class ListEnderecoView extends Vue {
    collection: PagedResp<Endereco> = new PagedResp(Endereco)
    toRemove: Endereco = new Endereco()

    async mounted() {
      await this.collection.search()
    }

    async removeItem() {
      await this.toRemove.remove()
      this.resetRemove()
      await this.collection.search()
    }

    openPersist(item: Endereco) {
      push(uri.persistEndereco(item.$id))
    }

    openRemoveModal(item: Endereco) {
      this.toRemove = item
    }

    resetRemove() {
      this.toRemove = new Endereco()
    }
  }
</script>
