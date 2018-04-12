<template>
  <div class="verti">
    <h1 class="header px-30 py-10 m-0">
      {{ $t("classes.ItemDoPrincipal.title") }}
    </h1>

    <section class="verti scroll weight-1 items-center-top p-30">

      <form @submit.prevent="persist" class="elevated w-full max-w-650 p-20">

        <multiselect-group v-model="model.itemDoPrincipal.principal"
                           :items="model.allPrincipal"
                           required
        >
          {{ $t("classes.ItemDoPrincipal.columns.principal") }}
        </multiselect-group>

        <input-group required
                     type="text"
                     maxlength="45"
                     v-model="model.itemDoPrincipal.titulo">
          {{ $t("classes.ItemDoPrincipal.columns.titulo") }}
        </input-group>


        <hr class="mb-20"/>
        <div class="verti items-center">
          <button type="submit" class="accent">{{ $t("persist.submit") }}</button>
        </div>
      </form>
    </section>
  </div>

</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import ItemDoPrincipalResp from '@/model/response/ItemDoPrincipalResp'
  import {successAndPush} from '@/simpli'

  @Component
  export default class PersistItemDoPrincipalView extends Vue {
    @Prop() id?: string
    model = new ItemDoPrincipalResp()

    async mounted() {
      await this.model.find(this.id || 0)
    }

    async persist() {
      await this.model.itemDoPrincipal.validate()
      await this.model.itemDoPrincipal.save()
      successAndPush('system.success.persist', '/listItemDoPrincipal')
    }
  }
</script>
