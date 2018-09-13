<template>
<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
  <div>
    <h1 class="adap-header px-30 py-10 m-0">
      {{ $t("classes.<%-origin.name%>.title") }}
    </h1>

    <await name="get" class="weight-1 items-center p-20">
      <form @submit.prevent="$await.run(persist, 'persist')" class="elevated padded w-full max-w-650">
<%_ for (var i in origin.attrs) { var attr = origin.attrs[i] _%>
<%-attr.buildPersist(origin.name, model.resp.originAttr)-%>
<%_ } _%>
        <hr class="mb-20"/>

        <await name="persist" class="verti items-center">
          <button type="submit" class="primary">{{ $t("persist.submit") }}</button>
        </await>
      </form>
    </await>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  <%-model.injectIntoDependence().build()%>
  import {$, successAndPush} from '@/simpli'

  @Component
  export default class Persist<%-origin.name%>View extends Vue {
    @Prop({type: [String, Number]}) id?: string
    model = new <%-model.name%>()

    async mounted() {
      await $.await.init('get')
      await this.model.find(this.id || 0)
      await $.await.done('get')
    }

    async persist() {
      await this.model.<%-model.resp.originAttr%>.validate()
      await this.model.<%-model.resp.originAttr%>.save()
      successAndPush('system.success.persist', '/<%-kebabCase(origin.name)%>/list')
    }
  }
</script>
