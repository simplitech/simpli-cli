<template>
  <modal name="modalRemove" v-model="value">
    <div class="verti text-center">
      <div class="horiz">
        <h4 class="weight-1 mt-0 mr-10">
          {{ $t("system.question.confirmRemove") }}
        </h4>
      </div>

      <p>{{ value && value.$tag }}</p>

      <div class="horiz items-center">
        <button type="button" class="mr-10" @click="close">{{ $t("app.cancel") }}</button>
        <button type="button" class="danger" @click="confirmEvent">{{ $t("app.remove") }}</button>
      </div>
    </div>
  </modal>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import {Resource} from '@/simpli'

  @Component
  export default class ModalRemove extends Vue {
    @Prop({required: true}) value!: Resource | null

    close() {
      this.$emit('input', null)
    }

    confirmEvent() {
      this.$emit('confirm')
    }
  }
</script>
