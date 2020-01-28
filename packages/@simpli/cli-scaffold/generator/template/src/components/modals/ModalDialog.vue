<template>
  <modal name="dialog" :closable="false" @open="openEvent" @close="closeEvent">
    <await name="processing" v-if="options">
      <div class="text-center">
        <div
          v-if="options.title"
          class="-mt-4 font-bold text-sm text-gray-700 select-none"
        >
          {{ options.title }}
        </div>

        <div
          v-if="options.message"
          class="my-2 p-4 bg-white text-base rounded-lg"
        >
          <div v-html="options.message" />
        </div>

        <div class="mx-1 grid grid-columns-2 grid-gap-2">
          <button
            type="button"
            :class="options.cancelClass"
            class="mr-2"
            @click="cancelEvent"
          >
            {{ options.cancelText }}
          </button>

          <button
            type="button"
            :class="options.confirmClass"
            @click="confirmEvent"
          >
            {{ options.confirmText }}
          </button>
        </div>
      </div>
    </await>
  </modal>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import {$} from 'simpli-web-sdk'
import {Dialog} from '@/helpers/dialog/Dialog'

@Component
export default class ModalDialog extends Vue {
  options: Dialog | null = null

  openEvent(payload?: Dialog) {
    this.$emit('open')

    this.options = payload ?? null
  }

  closeEvent() {
    this.options = null
    this.$emit('close')
  }

  async confirmEvent() {
    this.$emit('confirm')
    await $.await.run('processing', () => this.options?.onConfirm())
    this.close()
  }

  async cancelEvent() {
    this.$emit('cancel')
    await $.await.run('processing', () => this.options?.onCancel())
    this.close()
  }

  close() {
    this.$modal.close('dialog')
  }
}
</script>
