import DefaultPanelLayout from '@/views/layouts/DefaultPanelLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'

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

        {
          path: '/listPrincipal',
          component: ListPrincipalView,
        },
        {
          path: '/persistPrincipal',
          component: PersistPrincipalView,
        },
        {
          path: '/persistPrincipal/:id',
          name: 'persistPrincipal',
          component: PersistPrincipalView,
          props: true,
        },

        {
          path: '/listUser',
          component: ListUserView,
        },
        {
          path: '/persistUser',
          component: PersistUserView,
        },
        {
          path: '/persistUser/:id',
          name: 'persistUser',
          component: PersistUserView,
          props: true,
        },

        {
          path: '/listEndereco',
          component: ListEnderecoView,
        },
        {
          path: '/persistEndereco',
          component: PersistEnderecoView,
        },
        {
          path: '/persistEndereco/:id',
          name: 'persistEndereco',
          component: PersistEnderecoView,
          props: true,
        },

        {
          path: '/listTag',
          component: ListTagView,
        },
        {
          path: '/persistTag',
          component: PersistTagView,
        },
        {
          path: '/persistTag/:id',
          name: 'persistTag',
          component: PersistTagView,
          props: true,
        },

        {
          path: '/listConectado',
          component: ListConectadoView,
        },
        {
          path: '/persistConectado',
          component: PersistConectadoView,
        },
        {
          path: '/persistConectado/:id',
          name: 'persistConectado',
          component: PersistConectadoView,
          props: true,
        },

        {
          path: '/listGrupoDoPrincipal',
          component: ListGrupoDoPrincipalView,
        },
        {
          path: '/persistGrupoDoPrincipal',
          component: PersistGrupoDoPrincipalView,
        },
        {
          path: '/persistGrupoDoPrincipal/:id',
          name: 'persistGrupoDoPrincipal',
          component: PersistGrupoDoPrincipalView,
          props: true,
        },

        {
          path: '/listItemDoPrincipal',
          component: ListItemDoPrincipalView,
        },
        {
          path: '/persistItemDoPrincipal',
          component: PersistItemDoPrincipalView,
        },
        {
          path: '/persistItemDoPrincipal/:id',
          name: 'persistItemDoPrincipal',
          component: PersistItemDoPrincipalView,
          props: true,
        },

        {
          path: '/listExtensaoDoPrincipal',
          component: ListExtensaoDoPrincipalView,
        },
        {
          path: '/persistExtensaoDoPrincipal',
          component: PersistExtensaoDoPrincipalView,
        },
        {
          path: '/persistExtensaoDoPrincipal/:id',
          name: 'persistExtensaoDoPrincipal',
          component: PersistExtensaoDoPrincipalView,
          props: true,
        },

        {
          path: '/listConectorPrincipal',
          component: ListConectorPrincipalView,
        },
        {
          path: '/persistConectorPrincipal',
          component: PersistConectorPrincipalView,
        },
        {
          path: '/persistConectorPrincipal/:id1/:id2',
          name: 'persistConectorPrincipal',
          component: PersistConectorPrincipalView,
          props: true,
        },
      ],
    },
    {path: '/', redirect: '/login'},
    {path: '*', redirect: '/dashboard'},
  ],
}
