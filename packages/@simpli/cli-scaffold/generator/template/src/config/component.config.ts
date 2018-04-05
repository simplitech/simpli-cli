import {ComponentObject} from '@/types/plugin'

import Multiselect from 'vue-multiselect/src/Multiselect.vue'
import Modal from '@/components/modals/Modal.vue'
import ModalRemove from '@/components/modals/ModalRemove.vue'
import AdapHeader from '@/components/adap/AdapHeader.vue'
import AdapTable from '@/components/adap/AdapTable.vue'
import AdapOrderby from '@/components/adap/AdapOrderby.vue'
import AdapPagination from '@/components/adap/AdapPagination.vue'
import AdapSearchfield from '@/components/adap/AdapSearchfield.vue'
import InputGroup from '@/components/formGroup/InputGroup.vue'
import CheckboxGroup from '@/components/formGroup/CheckboxGroup.vue'
import MultiselectGroup from '@/components/formGroup/MultiselectGroup.vue'
import TextareaGroup from '@/components/formGroup/TextareaGroup.vue'

/*
 *** REGISTER HERE YOUR GLOBAL COMPONENTS ***
 */
export const Component: ComponentObject = {
  Multiselect,
  Modal,
  ModalRemove,
  AdapHeader,
  AdapTable,
  AdapOrderby,
  AdapPagination,
  AdapSearchfield,
  InputGroup,
  CheckboxGroup,
  MultiselectGroup,
  TextareaGroup,
}
