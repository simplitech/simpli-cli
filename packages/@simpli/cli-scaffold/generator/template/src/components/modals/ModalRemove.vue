<template>
  <modal name="modalRemove" v-model="openPayload">
    <div class="verti text-center">
      <div class="horiz">
        <h4 class="weight-1 font-semibold text-lg">
          {{ $t("system.question.confirmRemove") }}
        </h4>
      </div>

      <p class="my-4 p-4 border border-black-100 rounded-lg">{{ value && value.$tag }}</p>

      <div class="horiz items-center-center mb-2">
        <button type="button" class="mr-2 btn" @click="openPayload = null">{{ $t("app.cancel") }}</button>
        <button type="button" class="btn--contrast bg-danger" @click="$emit('confirm')">{{ $t("app.remove") }}</button>
      </div>
    </div>
  </modal>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'

  @Component
  export default class ModalRemove extends Vue {
    @Prop({ default: null }) value!: any

    get openPayload() {
      return this.value
    }

    set openPayload(val: any) {
      this.$emit('input', val)
    }
  }
</script>
