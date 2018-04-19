<template>
  <div class="verti">
    <h1 class="header px-30 py-10 m-0">
      {{ $t("classes.Tag.title") }}
    </h1>

    <section class="verti scroll weight-1 items-center-top p-30">
      <form @submit.prevent="persist" class="elevated w-full max-w-650 p-20">

        <input-group required
                     type="text"
                     maxlength="45"
                     v-model="model.tag.titulo">
          {{ $t("classes.Tag.columns.titulo") }}
        </input-group>

        <multiselect-group v-model="model.tag.tagPrincipal"
                           :items="model.allPrincipal"
                           required
        >
          {{ $t("classes.TagPrincipal.title") }}
        </multiselect-group>

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
  import {TagResp} from '@/model'
  import {successAndPush} from '@/simpli'

  @Component
  export default class PersistTagView extends Vue {
    @Prop() id?: string
    model = new TagResp()

    async mounted() {
      await this.model.find(this.id || 0)
    }

    async persist() {
      await this.model.tag.validate()
      await this.model.tag.save()
      successAndPush('system.success.persist', '/listTag')
    }
  }
</script>
