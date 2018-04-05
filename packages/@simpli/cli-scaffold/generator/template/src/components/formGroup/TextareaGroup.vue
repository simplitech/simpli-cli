<template>
  <div class="form-group" :class="{ required: !!required }">
    <label :for="`textarea-group${_uid}`"
           class="control-label">
      {{ label }}
      <slot></slot>
    </label>
    <textarea :id="`textarea-group${_uid}`"
              v-model="computedModel"
              class="form-control"
              :rows="rows"
              :required="!!required"></textarea>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

@Component
export default class TextareaGroup extends Vue {
  @Prop({type: String}) label?: string
  @Prop({type: String}) value?: string
  @Prop({type: Boolean}) required?: boolean
  @Prop({type: String}) rows?: string

  get computedModel() {
    return this.value!
  }

  set computedModel(val: string) {
    this.updateValue(val)
  }

  updateValue(val?: string) {
    this.$emit('input', val)
  }
}
</script>
