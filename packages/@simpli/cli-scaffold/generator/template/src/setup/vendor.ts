/**
 * @file
 * Vendor bootstrap
 *
 * This file contains the initialization of vendors library
 */

import Vue from 'vue'

import './registerServiceWorker'
import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import '@fortawesome/fontawesome-free/css/solid.min.css'
import '@fortawesome/fontawesome-free/css/regular.min.css'
import '@fortawesome/fontawesome-free/css/brands.min.css'

import VueMeta from 'vue-meta'
import VueMoment from 'vue-moment'

Vue.use(VueMeta)
Vue.use(VueMoment)
