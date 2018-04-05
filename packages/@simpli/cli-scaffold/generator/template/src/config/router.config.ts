import {RouterOptions} from 'vue-router'
import {UriObject} from '@/types/plugin'
import DefaultPanelLayout from '@/views/layouts/DefaultPanelLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import {ID} from '@/types/app'

import ListPrincipalView from '@/views/list/ListPrincipalView.vue'
import ListUserView from '@/views/list/ListUserView.vue'
import ListEnderecoView from '@/views/list/ListEnderecoView.vue'
import ListTagView from '@/views/list/ListTagView.vue'
import ListConectadoView from '@/views/list/ListConectadoView.vue'
import ListGrupoDoPrincipalView from '@/views/list/ListGrupoDoPrincipalView.vue'
import ListItemDoPrincipalView from '@/views/list/ListItemDoPrincipalView.vue'
import ListExtensaoDoPrincipalView from '@/views/list/ListExtensaoDoPrincipalView.vue'
import ListConectorPrincipalView from '@/views/list/ListConectorPrincipalView.vue'

import PersistPrincipalView from '@/views/persist/PersistPrincipalView.vue'
import PersistUserView from '@/views/persist/PersistUserView.vue'
import PersistEnderecoView from '@/views/persist/PersistEnderecoView.vue'
import PersistTagView from '@/views/persist/PersistTagView.vue'
import PersistConectadoView from '@/views/persist/PersistConectadoView.vue'
import PersistGrupoDoPrincipalView from '@/views/persist/PersistGrupoDoPrincipalView.vue'
import PersistItemDoPrincipalView from '@/views/persist/PersistItemDoPrincipalView.vue'
import PersistExtensaoDoPrincipalView from '@/views/persist/PersistExtensaoDoPrincipalView.vue'
import PersistConectorPrincipalView from '@/views/persist/PersistConectorPrincipalView.vue'

/*
 *** REGISTER HERE YOUR URIs FROM APP ***
 * Note1: you can access globally by using vm.$uri or helper
 * Note2: there are also vm.$route and $router available for routing process
 */
export const Uri: UriObject = {
  login: '/login',
  dashboard: '/dashboard',

  listPrincipal: '/listPrincipal',
  listUser: '/listUser',
  listEndereco: '/listEndereco',
  listTag: '/listTag',
  listConectado: '/listConectado',
  listGrupoDoPrincipal: '/listGrupoDoPrincipal',
  listItemDoPrincipal: '/listItemDoPrincipal',
  listExtensaoDoPrincipal: '/listExtensaoDoPrincipal',
  listConectorPrincipal: '/listConectorPrincipal',

  persistPrincipal: (id?: ID) => `/persistPrincipal/${id || ''}`,
  persistUser: (id?: ID) => `/persistUser/${id || ''}`,
  persistEndereco: (id?: ID) => `/persistEndereco/${id || ''}`,
  persistTag: (id?: ID) => `/persistTag/${id || ''}`,
  persistConectado: (id?: ID) => `/persistConectado/${id || ''}`,
  persistGrupoDoPrincipal: (id?: ID) => `/persistGrupoDoPrincipal/${id || ''}`,
  persistItemDoPrincipal: (id?: ID) => `/persistItemDoPrincipal/${id || ''}`,
  persistExtensaoDoPrincipal: (id?: ID) => `/persistExtensaoDoPrincipal/${id || ''}`,
  persistConectorPrincipal: (id1?: ID, id2?: ID) => `/persistConectorPrincipal/${id1 || ''}${id2 ? `/${id2}` : ''}`,
}

/*
 *** SET HERE YOUR ROUTER OPTIONS ***
 */
export const Router: RouterOptions = {
  routes: [
    {path: Uri.login, component: LoginView},
    {
      path: Uri.dashboard,
      component: DefaultPanelLayout,
      children: [
        {path: Uri.dashboard, component: DashboardView},

        {path: Uri.listPrincipal, component: ListPrincipalView},
        {path: Uri.persistPrincipal(), component: PersistPrincipalView},
        {path: Uri.persistPrincipal(':id'), component: PersistPrincipalView, props: true},

        {path: Uri.listUser, component: ListUserView},
        {path: Uri.persistUser(), component: PersistUserView},
        {path: Uri.persistUser(':id'), component: PersistUserView, props: true},

        {path: Uri.listEndereco, component: ListEnderecoView},
        {path: Uri.persistEndereco(), component: PersistEnderecoView},
        {path: Uri.persistEndereco(':id'), component: PersistEnderecoView, props: true},

        {path: Uri.listTag, component: ListTagView},
        {path: Uri.persistTag(), component: PersistTagView},
        {path: Uri.persistTag(':id'), component: PersistTagView, props: true},

        {path: Uri.listConectado, component: ListConectadoView},
        {path: Uri.persistConectado(), component: PersistConectadoView},
        {path: Uri.persistConectado(':id'), component: PersistConectadoView, props: true},

        {path: Uri.listGrupoDoPrincipal, component: ListGrupoDoPrincipalView},
        {path: Uri.persistGrupoDoPrincipal(), component: PersistGrupoDoPrincipalView},
        {path: Uri.persistGrupoDoPrincipal(':id'), component: PersistGrupoDoPrincipalView, props: true},

        {path: Uri.listItemDoPrincipal, component: ListItemDoPrincipalView},
        {path: Uri.persistItemDoPrincipal(), component: PersistItemDoPrincipalView},
        {path: Uri.persistItemDoPrincipal(':id'), component: PersistItemDoPrincipalView, props: true},

        {path: Uri.listExtensaoDoPrincipal, component: ListExtensaoDoPrincipalView},
        {path: Uri.persistExtensaoDoPrincipal(), component: PersistExtensaoDoPrincipalView},
        {path: Uri.persistExtensaoDoPrincipal(':id'), component: PersistExtensaoDoPrincipalView, props: true},

        {path: Uri.listConectorPrincipal, component: ListConectorPrincipalView},
        {path: Uri.persistConectorPrincipal(), component: PersistConectorPrincipalView},
        {path: Uri.persistConectorPrincipal(':id1', ':id2'), component: PersistConectorPrincipalView, props: true},
      ],
    },
    {path: '/', redirect: Uri.login},
    {path: '*', redirect: Uri.dashboard},
  ],
}
