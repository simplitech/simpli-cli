/**
 * @file
 * Router Configuration
 * Used in library: vue-router
 *
 * Use this file to register the App routes
 * See https://router.vuejs.org/guide/#javascript
 * This configuration will be set in @/bootstrap/app.ts
 */

import DefaultPanelLayout from '@/views/layouts/DefaultPanelLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
import SignInView from '@/views/SignInView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import RecoverPasswordView from '@/views/RecoverPasswordView.vue'
<%_ } _%>

<%_ var kebabCase = rootOptions.scaffoldSetup.kebabCase _%>
<%_ var resourceModels = rootOptions.scaffoldSetup.resourceModels _%>
<%_ for (var i in resourceModels) { var resource = resourceModels[i] _%>
import List<%-resource.name%>View from '@/views/list/List<%-resource.name%>View.vue'
<%_ } _%>

<%_ var respResourceModels = rootOptions.scaffoldSetup.respResourceModels _%>
<%_ for (var i in respResourceModels) { var resource = respResourceModels[i] _%>
<%_ if (resource.resp.origin) { _%>
import Persist<%-resource.resp.origin%>View from '@/views/persist/Persist<%-resource.resp.origin%>View.vue'
<%_ } _%>
<%_ } _%>

/**
 * VUE Router Configuration
 */
export const router = {
  routes: [
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
    {
      path: '/signIn',
      name: 'signIn',
      component: SignInView,
    },
    {
      path: '/password/reset',
      name: 'resetPassword',
      component: ResetPasswordView,
    },
    {
      path: '/password/recover/:hash',
      name: 'recoverPassword',
      component: RecoverPasswordView,
      props: true,
    },
<%_ } _%>
    {
      path: '/dashboard',
      component: DefaultPanelLayout,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: DashboardView,
        },
<%_ for (var i in resourceModels) { var resource = resourceModels[i] _%>
        {path: '/<%-kebabCase(resource.name)%>/list', component: List<%-resource.name%>View},
<%_ } _%>
<%_ for (var i in respResourceModels) { var resource = respResourceModels[i] _%>
<%_ if (resource.resp.origin) { _%>

        {path: '/<%-kebabCase(resource.resp.origin)%>/new', component: Persist<%-resource.resp.origin%>View},
        {
          path: '/<%-kebabCase(resource.resp.origin)%>/edit<%-resource.resource.endpointParamsImploded%>',
          name: 'edit<%-resource.resp.origin%>',
          component: Persist<%-resource.resp.origin%>View,
          props: true,
        },
<%_ } _%>
<%_ } _%>
      ],
    },
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
    {path: '/', redirect: '/signIn'},
<%_ } else { _%>
    {path: '/', redirect: '/dashboard'},
<%_ } _%>
    {path: '*', redirect: '/dashboard'},
  ],
}
