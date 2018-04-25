<template>
<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
  <div class="verti">
    <h1 class="header px-30 py-10 m-0">
      {{ $t("classes.<%-origin.name%>.title") }}
    </h1>

    <section class="verti scroll weight-1 items-center-top p-30">
      <form @submit.prevent="persist" class="elevated w-full max-w-650 p-20">
<%_ for (var i in origin.attrs) { var attr = origin.attrs[i] _%>
<%-attr.buildPersist(origin.name, model.resp.originAttr)-%>
<%_ } _%>
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
  <%-model.injectIntoDependence().build()%>
  import {successAndPush} from '@/simpli'

  @Component
  export default class Persist<%-origin.name%>View extends Vue {
    @Prop({type: [String, Number]}) id?: string
    model = new <%-model.name%>()

    async mounted() {
      await this.model.find(this.id || 0)
    }

    async persist() {
      await this.model.<%-model.resp.originAttr%>.validate()
      await this.model.<%-model.resp.originAttr%>.save()
      successAndPush('system.success.persist', '/<%-kebabCase(origin.name)%>/list')
    }
  }
</script>
