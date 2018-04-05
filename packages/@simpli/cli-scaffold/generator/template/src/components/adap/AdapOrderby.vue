<template>
  <div @click="collection.setOrderBy(name)" style="cursor:pointer" class="orderby"
       :class="{ 'asc': collection.asc, 'desc': !collection.asc }">
    <slot></slot>
    <span :class="{ 'caret': collection.orderBy === name }"></span>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import PageCollection from '@/app/http/PageCollection'
import {Resource} from '@/app/http/Resource'

@Component
export default class AdapOrderBy extends Vue {
  @Prop({required: true}) collection?: PageCollection<Resource>
  @Prop({required: true}) name?: string
}
</script>
