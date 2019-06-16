/**
 * @file
 * Vendor bootstrap
 *
 * This file contains the initialization of vendors library
 */

import Vue from 'vue'

import './registerServiceWorker'
import 'font-awesome/css/font-awesome.css'

import VueMeta from 'vue-meta'
import VueMoment from 'vue-moment'

Vue.use(VueMeta)
Vue.use(VueMoment)
