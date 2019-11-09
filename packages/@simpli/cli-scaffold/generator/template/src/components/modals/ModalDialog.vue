<template>
  <modal :name="name" @open="openEvent" @close="closeEvent" :closable="false">
    <await name="processing" v-if="options">
      <div class="verti text-center">
        <div class="horiz">
          <div class="weight-1 font-semibold text-lg">
            {{ options.title }}
          </div>
        </div>

        <div v-if="options.message" class="my-4 p-4 border border-black-100 rounded-lg">
          {{ options.message }}
        </div>

        <div class="grid grid-columns-2 grid-gap-2">
          <button type="button"
                  :class="options.cancelClass"
                  class="mr-2"
                  @click="cancelEvent">
            {{ options.cancelText }}
          </button>

          <button type="button"
                  :class="options.confirmClass"
                  @click="confirmEvent">
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

  export interface PayloadObject {
    title: string,
    message: string | null,
    confirmText: string | null,
    cancelText: string | null,
    confirmClass: string | null,
    cancelClass: string | null,
    onConfirm: Function,
    onCancel: Function,
  }

  @Component
  export default class ModalDialog extends Vue {
    @Prop({type: String, default: 'dialog'}) name!: string
    @Prop({type: String, default: null}) title!: string | null
    @Prop({type: String, default: null}) message!: string | null
    @Prop({type: String, default: () => $.t('app.confirm') as string}) confirmText!: string | null
    @Prop({type: String, default: () => $.t('app.cancel') as string}) cancelText!: string | null
    @Prop({type: String, default: 'btn btn--contrast'}) confirmClass!: string | null
    @Prop({type: String, default: 'btn btn--solid'}) cancelClass!: string | null

    options: PayloadObject | null = null

    openEvent(payload?: PayloadObject) {
      this.$emit('open')

      if (payload) {
        this.options = payload
        if (!payload.confirmText) {
          this.options.confirmText = this.confirmText
        }
        if (!payload.cancelText) {
          this.options.cancelText = this.cancelText
        }
        if (!payload.confirmClass) {
          this.options.confirmClass = this.confirmClass
        }
        if (!payload.cancelClass) {
          this.options.cancelClass = this.cancelClass
        }
      } else {
        this.options = {
          title: this.title ?? '',
          message: this.message,
          confirmText: this.confirmText,
          cancelText: this.cancelText,
          confirmClass: this.confirmClass,
          cancelClass: this.confirmClass,
          onConfirm: () => {/**/},
          onCancel: () => {/**/},
        }
      }
    }

    closeEvent() {
      this.options = null
      this.$emit('close')
    }

    async confirmEvent() {
      this.$emit('confirm')
      const options = this.options
      if (options) {
        await $.await.run('processing', () => options.onConfirm())
      }
      this.close()
    }

    async cancelEvent() {
      this.$emit('cancel')
      const options = this.options
      if (options) {
        await $.await.run('processing', () => options.onCancel())
      }
      this.close()
    }

    close() {
      this.$modal.close(this.name)
    }
  }
</script>
