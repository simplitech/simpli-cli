<template>
  <div class="verti">
    <adap-header :collection="collection"
                 :title="$t('classes.Conectado.title')"
                 :persistUrl="$uri.persistConectado()"
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
  import Conectado from '@/model/Conectado'
  import PagedResp from '@/model/response/PagedResp'
  import {uri, push} from '@/helpers'

  @Component
  export default class ListConectadoView extends Vue {
    collection: PagedResp<Conectado> = new PagedResp(Conectado)
    toRemove: Conectado = new Conectado()

    async mounted() {
      await this.collection.search()
    }

    async removeItem() {
      await this.toRemove.remove()
      this.resetRemove()
      await this.collection.search()
    }

    openPersist(item: Conectado) {
      push(uri.persistConectado(item.$id))
    }

    openRemoveModal(item: Conectado) {
      this.toRemove = item
    }

    resetRemove() {
      this.toRemove = new Conectado()
    }
  }
</script>
