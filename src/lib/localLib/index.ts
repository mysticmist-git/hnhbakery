export { handleLoginWithGoogle } from '../auth/auth';

export type { User } from '../auth/auth';

export {
  DEFAULT_ROW,
  crudTargets,
  initManageState,
  manageReducer,
} from './manage';

export { checkIfDataChanged, isDataChanged, memoize } from './manage-modal';

export type {
  CrudTarget,
  ManageActionType,
  ManageContextType,
  ManageState,
  ModalMode,
} from './manage';
