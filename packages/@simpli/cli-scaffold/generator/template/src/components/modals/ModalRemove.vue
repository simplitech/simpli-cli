<template>
  <modal :name="name">
    <div class="verti text-center">
      <div class="horiz">
        <h4 class="weight-1 mt-0 mr-10">
          {{ $t("system.question.confirmRemove") }}
        </h4>
      </div>

      <p>{{ text }}</p>

      <div class="horiz items-center">
        <button type="button" class="mr-10" @click="cancelEvent">{{ $t("app.cancel") }}</button>
        <button type="button" class="danger" @click="confirmEvent">{{ $t("app.remove") }}</button>
      </div>
    </div>
  </modal>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import {PageCollection, Resource} from '@/simpli'
  import PagedResp from '@/model/collection/PagedResp'

  @Component
  export default class ModalRemove extends Vue {
    @Prop({type: String}) name?: string
    @Prop({default: ''}) text?: string

    cancelEvent() {
      this.$emit('cancel')
    }

    confirmEvent() {
      this.$emit('confirm')
    }
  }
</script>
