declare module 'v-money' {
  import {PluginFunction} from 'vue/types/plugin'
  const VueMoney: PluginFunction<{
    decimal: string,
    thousands: string,
    prefix: string,
    precision: number,
  }>
  export default VueMoney
}
