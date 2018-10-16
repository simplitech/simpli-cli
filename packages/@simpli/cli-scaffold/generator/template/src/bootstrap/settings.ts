/**
 * @file
 * App bootstrap settings
 *
 * This file contains the settings before the app initialization
 */

import Vue from 'vue'
import {$} from '@/simpli'

import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import GridLoader from 'vue-spinner/src/GridLoader.vue'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import RiseLoader from 'vue-spinner/src/RiseLoader.vue'
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import RotateLoader from 'vue-spinner/src/RotateLoader.vue'
import FadeLoader from 'vue-spinner/src/FadeLoader.vue'
import PacmanLoader from 'vue-spinner/src/PacmanLoader.vue'
import SquareLoader from 'vue-spinner/src/SquareLoader.vue'
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
import SkewLoader from 'vue-spinner/src/SkewLoader.vue'
import MoonLoader from 'vue-spinner/src/MoonLoader.vue'
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import BounceLoader from 'vue-spinner/src/BounceLoader.vue'
import DotLoader from 'vue-spinner/src/DotLoader.vue'

Vue.config.productionTip = false

$.await.addLoader('PulseLoader', PulseLoader)
$.await.addLoader('GridLoader', GridLoader)
$.await.addLoader('ClipLoader', ClipLoader)
$.await.addLoader('RiseLoader', RiseLoader)
$.await.addLoader('BeatLoader', BeatLoader)
$.await.addLoader('SyncLoader', SyncLoader)
$.await.addLoader('RotateLoader', RotateLoader)
$.await.addLoader('FadeLoader', FadeLoader)
$.await.addLoader('PacmanLoader', PacmanLoader)
$.await.addLoader('SquareLoader', SquareLoader)
$.await.addLoader('ScaleLoader', ScaleLoader)
$.await.addLoader('SkewLoader', SkewLoader)
$.await.addLoader('MoonLoader', MoonLoader)
$.await.addLoader('RingLoader', RingLoader)
$.await.addLoader('BounceLoader', BounceLoader)
$.await.addLoader('DotLoader', DotLoader)

$.await.defaultTransition = 'fade'
$.await.defaultSpinner = 'ScaleLoader'
$.await.defaultSpinnerColor = '#21AEB6'
$.await.defaultSpinnerPadding = '0'
$.await.defaultSpinnerScale = 1

$.modal.defaultBody = document.body
$.modal.defaultTransition = 'blur'
$.modal.defaultBackgroundTransition = 'fade'
$.modal.defaultClosable = true
$.modal.defaultCloseOutside = true
