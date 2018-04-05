import {SnotifyGlobalConfig, SnotifyPosition, SnotifyToastConfig} from 'vue-snotify'

/*
 * ===================================================== *
 *** This TOAST was provided by a Third-Party project ***
 * ===================================================== *
 * Access docs in https://github.com/artemsky/vue-snotify
 * The standard configuration can be found below
 * You can use this toast globally by using vm.$snotify or helper
 */

/*
 *** REGISTER HERE YOUR STYLES ***
 * Note: you must create a class in main.scss named as your style name
 */
export enum ToastStyle {
  MATERIAL = 'material',
  DARK = 'dark',
  SIMPLE = 'simple',
}

/*
 *** BACKGROUND OPACITY WHEN TOAST (-1 disable) ***
 */
export enum ToastBackdrop {
  NONE = -1,
  WEAK = 0.2,
  NORMAL = 0.4,
  STRONG = 0.7,
  FULL = 1,
}

/*
 *** CHOSE HERE YOUR STYLE ***
 */
export const ToastDefaultStyle: ToastStyle = ToastStyle.MATERIAL

/*
 *** MODIFY HERE THE TOAST GLOBAL CONFIG ***
 */
export const ToastGlobalConfig: SnotifyGlobalConfig = {
  newOnTop: true, // true = stack, false = queue
  maxOnScreen: 5,
  maxAtPosition: 5,
}

/*
 *** MODIFY HERE THE TOAST DEFAULT CONFIG ***
 */
export const ToastDefaultConfig: SnotifyToastConfig = {
  timeout: 5000, // 0 is infinite
  position: SnotifyPosition.rightTop,
  showProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  titleMaxLength: 31,
  bodyMaxLength: 127,
  backdrop: ToastBackdrop.NONE,
}

/*
 *** ADD HERE YOUR CUSTOM CONFIGS ***
 * Note1: you can import these configs and use in vm.$snotify(..., YOUR_CONFIG)
 * Example:
 * import {MyToast} from '@/config/toast.config
 * ...
 * this.$snotify('Hello world', MyToast)
 */
export const ToastImportant: SnotifyToastConfig = {
  timeout: 0,
  position: SnotifyPosition.centerCenter,
  showProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  backdrop: ToastBackdrop.STRONG,
}
/*******************************************/
