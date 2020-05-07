import {Component, Vue} from 'vue-property-decorator'

@Component
export class MixinScreenSize extends Vue {
  screenWidth = window.innerWidth

  get isMobile() {
    return this.screenWidth <= Number(process.env.VUE_APP_SMALL_SCREEN!)
  }

  get isTablet() {
    return (
      this.screenWidth > Number(process.env.VUE_APP_SMALL_SCREEN!) &&
      this.screenWidth <= Number(process.env.VUE_APP_MEDIUM_SCREEN!)
    )
  }

  get isSmallDesktop() {
    return (
      this.screenWidth > Number(process.env.VUE_APP_MEDIUM_SCREEN!) &&
      this.screenWidth <= Number(process.env.VUE_APP_LARGE_SCREEN!)
    )
  }

  get isDesktop() {
    return this.screenWidth > Number(process.env.VUE_APP_LARGE_SCREEN!)
  }

  created() {
    window.addEventListener('resize', this.resizeEvent)
    this.resizeEvent()
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.resizeEvent)
  }

  resizeEvent() {
    this.screenWidth = window.innerWidth
  }
}
