<template>
  <modal v-if="active" class="animated fadeIn">
    <div class="verti">
      <div class="horiz">
        <h4 class="weight-1 mt-0 mr-10">
          {{ $t("system.question.confirmRemove") }}
        </h4>
        <a class="close" @click="cancelEvent"></a>
      </div>
      <p class="text-center">{{ text }}</p>
      <div class="horiz items-center">
        <button type="button" @click="cancelEvent">{{ $t("app.cancel") }}</button>
        <button type="button" class="danger ml-10" @click="confirmEvent">{{ $t("app.remove") }}</button>
      </div>
    </div>
  </modal>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import {PageCollection, Resource} from '@/simpli'
  import {PagedResp} from '@/model'

  @Component
  export default class ModalRemove extends Vue {
    @Prop({default: false}) active?: boolean
    @Prop({default: ''}) text?: string

    cancelEvent() {
      this.$emit('cancel')
    }

    confirmEvent() {
      this.$emit('confirm')
    }
  }
</script>
