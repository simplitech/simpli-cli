/**
 * @file
 * Vendor bootstrap
 *
 * This file contains the initialization of vendors library
 */

import Vue from 'vue'

import './registerServiceWorker'
import 'font-awesome/css/font-awesome.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import 'chart.js'

import VueMeta from 'vue-meta'
import VueMoment from 'vue-moment'
import VueChartkick from 'vue-chartkick'

Vue.use(VueMeta)
Vue.use(VueMoment)
Vue.use(VueChartkick, {Chartkick: require('chartkick')})
