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

import AuthLayout from '@/views/layouts/AuthLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
import SignInView from '@/views/SignInView.vue'
import RecoverPasswordByMailView from '@/views/RecoverPasswordByMailView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'

<%_ } _%>
<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
<%_ var resourceModels = rootOptions.scaffoldSetup.resourceModels _%>
<%_ if (resourceModels.length) { _%>
<%_ for (var i in resourceModels) { var resource = resourceModels[i] _%>
import List<%-resource.name%>View from '@/views/list/List<%-resource.name%>View.vue'
<%_ } _%>

<%_ for (var i in resourceModels) { var resource = resourceModels[i] _%>
import Persist<%-resource.name%>View from '@/views/persist/Persist<%-resource.name%>View.vue'
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
      path: '/password/recover/:hash',
      name: 'resetPassword',
      component: ResetPasswordView,
      props: true,
    },
<%_ } _%>
    {
      path: '/dashboard',
      component: AuthLayout,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: DashboardView,
        },
<%_ for (var i in resourceModels) { var resource = resourceModels[i] _%>

        {path: '/<%-kebabCase(resource.name)%>/list', component: List<%-resource.name%>View},
        {path: '/<%-kebabCase(resource.name)%>/new', component: Persist<%-resource.name%>View},
        {
          path: '/<%-kebabCase(resource.name)%>/edit<%-resource.resource.endpointParamsImploded%>',
          name: 'edit<%-resource.name%>',
          component: Persist<%-resource.name%>View,
          props: true,
        },
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
