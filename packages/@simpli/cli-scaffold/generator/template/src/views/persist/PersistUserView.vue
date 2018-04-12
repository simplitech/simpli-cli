<template>

  <div class="verti">
    <h1 class="header px-30 py-10 m-0">
      {{ $t("classes.User.title") }}
    </h1>

    <section class="verti scroll weight-1 items-center-top p-30">

      <form @submit.prevent="persist" class="elevated w-full max-w-650 p-20">


        <input-group required
                     type="email"
                     maxlength="45"
                     v-model="model.user.email">
          {{ $t("classes.User.columns.email") }}
        </input-group>

        <input-group
                type="password"
                maxlength="200"
                v-model="model.user.senha"
                :placeholder="model.user.$id ? $t('app.onlyIfWantChangePassword') : ''">
          {{ $t("classes.User.columns.senha") }}
        </input-group>


        <hr class="mb-20"/>
        <div class="verti items-center">
          <button type="submit" class="accent">{{ $t("persist.submit") }}</button>
        </div>
      </form>
    </section>
  </div>

</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import UserResp from '@/model/response/UserResp'
  import {successAndPush, encrypt} from '@/simpli'

  @Component
  export default class PersistUserView extends Vue {
    @Prop() id?: string
    model = new UserResp()

    async mounted() {
      await this.model.find(this.id || 0)
    }

    async persist() {
      await this.model.user.validate()
      this.model.user.senha = encrypt(this.model.user.senha || '')
      await this.model.user.save()
      successAndPush('system.success.persist', '/listUser')
    }
  }
</script>
