<template>
<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
  <div class="filter-<%-kebabCase(model.name)%>">
    <div class="filter-<%-kebabCase(model.name)%>__content">
      <div v-for="field in schema.allFields" :key="field">
        <render-schema v-model="collection" :schema="schema" :field="field" />
      </div>
    </div>

    <await name="softQuery" spinner="MoonLoader" class="self-center">
      <button @click="doFilter" class="lg:w-40 btn btn--contrast bg-secondary">
        {{ $t('app.filter') }}
      </button>
    </await>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Watch, Vue} from 'vue-property-decorator'
<%-model.injectCollectionIntoDependence().build()%>
<%-model.injectSchemaIntoDependence('Filter').build()%>

@Component
export default class Filter<%-model.name%> extends Vue {
  @Prop({type: Object, required: true}) collection!: <%-model.name%>Collection

  schema = new Filter<%-model.name%>Schema()

  async created() {
    await this.populateFilterOptions()
  }

  async populateFilterOptions() {
    this.collection.resource = this.schema

    const promises: Array<Promise<any>> = [
<%_ for (var i in model.resolvedPersistDependencies) { var dependence = model.resolvedPersistDependencies[i] _%>
      this.collection.resource.collection<%-dependence.children[0]%>.queryAsPage(),
<%_ } _%>
    ]

    await this.$await.run('softQuery', () => Promise.all(promises))
  }

  async doFilter() {
    this.$emit('submit')
    await this.$await.run('softQuery', () => this.collection.queryAsPage())
  }
}
</script>

<style lang="scss" scoped>
.filter-<%-kebabCase(model.name)%> {
  @apply verti p-4 border-b border-primary;

  .filter-<%-kebabCase(model.name)%>__content {
    @apply mb-8 grid gap-4;

    @screen sm {
      @apply grid-cols-2;
    }

    @screen md {
      @apply grid-cols-3;
    }

    @screen lg {
      @apply grid-cols-4;
    }
  }
}
</style>
