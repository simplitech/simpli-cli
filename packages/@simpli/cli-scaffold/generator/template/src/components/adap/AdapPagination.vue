<template>

  <ul class="pagination">
    <li><a @click="prev">&laquo;</a></li>

    <li :class="current === first ? 'active' : ''">
      <a @click="goto(first)">{{first}}</a>
    </li>

    <li v-if="current > first + gap + 1"><a>...</a></li>

    <li v-for="n in gap*2 + 1" v-if="index(n) > first && index(n) < last" :class="current === index(n) ? 'active' : ''">
      <a @click="goto(index(n))">{{ index(n) }}</a>
    </li>

    <li v-if="current < last - gap - 1"><a>...</a></li>

    <li :class="current === last ? 'active' : ''" v-if="last !== 1">
      <a @click="goto(last)">{{last}}</a>
    </li>

    <li><a @click="next">&raquo;</a></li>
  </ul>

</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import PageCollection from '@/app/http/PageCollection'
import {Resource} from '@/app/http/Resource'

@Component
export default class AdapPagination extends Vue {
  @Prop({required: true}) collection?: PageCollection<Resource>
  @Prop({default: 2}) gap?: number

  get first() {
    return 1
  }

  get current() {
    return (this.collection!.currentPage || 0) + 1
  }

  get last() {
    return this.collection!.lastPage + 1
  }

  async goto(n: number) {
    return await this.collection!.setCurrentPage(n - 1)
  }

  async next() {
    return await this.collection!.nextPage()
  }

  async prev() {
    return await this.collection!.prevPage()
  }

  index(n: number) {
    let pos = this.current

    if (this.current < 1 + this.gap!) {
      pos = 1 + this.gap!
    } else if (this.current > this.last - this.gap!) {
      pos = this.last - this.gap!
    }

    return (n + pos) - this.gap! - 1
  }
}
</script>
