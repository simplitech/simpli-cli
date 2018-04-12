<template>
  <div class="verti">
    <adap-header :collection="collection"
                 :title="$t('classes.User.title')"
                 persistUrl="/persistUser"
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
  import User from '@/model/User'
  import PagedResp from '@/model/response/PagedResp'
  import {pushByName} from '@/simpli'

  @Component
  export default class ListUserView extends Vue {
    collection = new PagedResp(User)
    toRemove = new User()

    async mounted() {
      await this.collection.search()
    }

    async removeItem() {
      await this.toRemove.remove()
      this.resetRemove()
      await this.collection.search()
    }

    openPersist(item: User) {
      pushByName('persistUser', item.$id)
    }

    openRemoveModal(item: User) {
      this.toRemove = item
    }

    resetRemove() {
      this.toRemove = new User()
    }
  }
</script>
