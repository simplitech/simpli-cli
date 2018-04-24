import DefaultPanelLayout from '@/views/layouts/DefaultPanelLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'

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

/*
 *** SET HERE THE ROUTER OPTIONS ***
 */
export const router = {
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
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
    {path: '/', redirect: '/login'},
    {path: '*', redirect: '/dashboard'},
  ],
}
