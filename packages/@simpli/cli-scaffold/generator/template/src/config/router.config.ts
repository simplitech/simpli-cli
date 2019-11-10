/**
 * @file
 * Router Configuration
 * Used in library: vue-router
 *
 * Use this file to register the App routes
 * See https://router.vuejs.org/guide/#javascript
 * This configuration will be set in @/bootstrap/app.ts
 */

import {RouterOptions} from 'vue-router'

import DefaultLayout from '@/views/layouts/DefaultLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>

import SignInView from '@/views/auth/SignInView.vue'
import RecoverPasswordByMailView from '@/views/auth/RecoverPasswordByMailView.vue'
import ResetPasswordView from '@/views/auth/ResetPasswordView.vue'
<%_ } _%>
<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
<%_ var resourceModels = rootOptions.scaffoldSetup.resourceModels _%>
<%_ if (resourceModels.length) { _%>

<%_ for (var i in resourceModels) { var resource = resourceModels[i] _%>
<%_ if (resource.collectionName) { _%>
import List<%-resource.name%>View from '@/views/list/List<%-resource.name%>View.vue'
<%_ } _%>
<%_ } _%>
<%_ for (var i in resourceModels) { var resource = resourceModels[i] _%>
<%_ if (i === 0) { _%>

<%_ } _%>
<%_ if (resource.collectionName) { _%>
import Persist<%-resource.name%>View from '@/views/persist/Persist<%-resource.name%>View.vue'
<%_ } _%>
<%_ } _%>
<%_ } _%>
/**
 * VUE Router Configuration
 */
export const router: RouterOptions = {
  routes: [
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
    {
      path: '/sign-in',
      name: 'signIn',
      component: SignInView,
    },
    {
      path: '/password/recover',
      name: 'recoverPasswordByMail',
      component: RecoverPasswordByMailView,
    },
    {
      path: '/password/reset/:hash',
      name: 'resetPassword',
      component: ResetPasswordView,
      props: true,
    },
<%_ } _%>
    {
      path: '/dashboard',
      component: DefaultLayout,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: DashboardView,
        },
<%_ for (var i in resourceModels) { var resource = resourceModels[i] _%>
<%_ if (resource.collectionName) { _%>

        {path: '/<%-kebabCase(resource.name)%>/list', component: List<%-resource.name%>View},
        {path: '/<%-kebabCase(resource.name)%>/new', component: Persist<%-resource.name%>View},
        {
          path: '/<%-kebabCase(resource.name)%>/edit<%-resource.resource.endpointParamsImploded%>',
          name: 'edit<%-resource.name%>',
          component: Persist<%-resource.name%>View,
          props: true,
        },
<%_ } _%>
<%_ } _%>
      ],
    },
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
    {path: '/', redirect: '/sign-in'},
<%_ } else { _%>
    {path: '/', redirect: '/dashboard'},
<%_ } _%>
    {path: '*', redirect: '/dashboard'},
  ],
}
