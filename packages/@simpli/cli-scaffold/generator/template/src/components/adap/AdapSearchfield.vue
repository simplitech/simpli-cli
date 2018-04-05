<template>
  <input type="text"
         class="form-control my-10"
         v-model="collection.querySearch"
         @keyup="collection.debounce()"
  />
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import PageCollection from '@/app/http/PageCollection'
import {Resource} from '@/app/http/Resource'

@Component
export default class AdapSearchfield extends Vue {
  @Prop({required: true}) collection?: PageCollection<Resource>
}
</script>
