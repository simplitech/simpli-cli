import {Component, Vue} from 'vue-property-decorator'
import {classToPlain} from 'class-transformer'

@Component
export class MixinRouteMatch extends Vue {
  get hasQueryParams() {
    return Object.keys(this.$route.query).length
  }

  updateRouteFromObject(value: any, extra: any = {}) {
    const query: any = {...this.$route.query, ...classToPlain(value), ...extra}
    this.prepareToSerialize(query)
    this.$router.replace({query})
  }

  updateObjectFromRoute(value: any) {
    const query = {...this.$route.query}
    this.prepareToUnserialize(query)
    Object.assign(value, query)
  }

  private prepareToSerialize(obj: any) {
    Object.keys(obj).forEach(key => {
      if (obj[key] == null || obj[key] === '') {
        delete obj[key]
      }
    })
  }

  private prepareToUnserialize(obj: any) {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'string' && !obj[key].length) {
        obj[key] = null
      } else if (typeof obj[key] === 'string' && !isNaN(obj[key])) {
        obj[key] = Number(obj[key])
      } else if (obj[key] === 'true') {
        obj[key] = true
      } else if (obj[key] === 'false') {
        obj[key] = false
      }
    })
  }
}
