<template>
  <div class="filter-toggle">
    <a
      @click="toggle"
      class="filter-toggle__btn btn btn--flat"
      :class="btnClass"
    >
      <i class="fas fa-sliders-h mr-2" />
      {{ $t('app.moreFilters') }}
      <i class="ml-2 icon icon-arrow-right" />
    </a>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Watch, Vue} from 'vue-property-decorator'

@Component
export default class FilterToggle extends Vue {
  @Prop({type: Boolean, default: false}) value!: boolean

  get input() {
    return this.value
  }
  set input(val) {
    this.$emit('input', val)
  }

  get btnClass() {
    return {
      'filter-toggle__btn--active': this.input,
    }
  }

  async toggle() {
    this.input = !this.input
  }
}
</script>

<style lang="scss" scoped>
.filter-toggle {
  .filter-toggle__btn {
    @apply transition px-4 horiz items-center;

    .icon-arrow-right {
      @apply transition;
    }

    &.filter-toggle__btn--active {
      .icon-arrow-right {
        transform: rotate(90deg);
      }
    }
  }
}
</style>
