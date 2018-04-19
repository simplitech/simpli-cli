import DefaultPanelLayout from '@/views/layouts/DefaultPanelLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'

<%_ var resources = rootOptions.scaffoldSetup.resourceModels _%>
<%_ for (var i in resources) { var resource = resources[i] _%>
import List<%-resource.name%>View from '@/views/list/List<%-resource.name%>View.vue'
<%_ } _%>

<%_ for (var i in resources) { var resource = resources[i] _%>
import Persist<%-resource.name%>View from '@/views/persist/Persist<%-resource.name%>View.vue'
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
<%_ for (var i in resources) { var resource = resources[i] _%>

        {
          path: '/list<%-resource.name%>',
          component: List<%-resource.name%>View,
        },
        {
          path: '/persist<%-resource.name%>',
          component: Persist<%-resource.name%>View,
        },
        {
          path: '/persist<%-resource.name%><%-resource.strParams()%>',
          name: 'persist<%-resource.name%>',
          component: Persist<%-resource.name%>View,
          props: true,
        },
<%_ } _%>

      ],
    },
    {path: '/', redirect: '/login'},
    {path: '*', redirect: '/dashboard'},
  ],
}
