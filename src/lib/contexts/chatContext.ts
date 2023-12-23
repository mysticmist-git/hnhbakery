import { auth } from '@/firebase/config';
import { createContext, useEffect, useReducer, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getUserByUid } from '../DAO/userDAO';
import { DEFAULT_GROUP_ID } from '../DAO/groupDAO';

export type ChatContextType = {
  open: boolean;
  //
  uidClient: string;
  uidStaff: string;
  compileId: string;
};

export interface ChatAction {
  type: 'setOpen' | 'setUidClient' | 'setUidStaff';
  payload: ChatContextType;
}

export const ChatContext = createContext<{
  state: ChatContextType;
  dispatch: React.Dispatch<ChatAction>;
}>({
  state: {
    open: false,
    //
    uidClient: '',
    uidStaff: '',
    compileId: '',
  },
  dispatch: () => {},
});

export function initChatContext() {
  const INITIAL_STATE: ChatContextType = {
    open: false,
    //
    uidClient: '',
    uidStaff: '',
    compileId: '',
  };

  const chatReducer = (
    state: ChatContextType,
    action: ChatAction
  ): ChatContextType => {
    switch (action.type) {
      case 'setOpen':
        return {
          ...action.payload,
          open: action.payload.open,
        };
      case 'setUidClient':
        return {
          ...action.payload,
          uidClient: action.payload.uidClient,
          compileId:
            action.payload.uidClient < action.payload.uidStaff
              ? action.payload.uidClient + '_' + action.payload.uidStaff
              : action.payload.uidStaff + '_' + action.payload.uidClient,
        };
      case 'setUidStaff':
        return {
          ...action.payload,
          uidStaff: action.payload.uidStaff,
          compileId:
            action.payload.uidClient < action.payload.uidStaff
              ? action.payload.uidClient + '_' + action.payload.uidStaff
              : action.payload.uidStaff + '_' + action.payload.uidClient,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  const [user, userLoading, userError] = useAuthState(auth);

  useEffect(() => {
    dispatch({
      type: 'setUidStaff',
      payload: { ...state, uidStaff: '9fFTtnJh5Ra5W48j0Snuj8UryxA3' },
    });
    if (!user) return;
    async function setUidClient() {
      if (!user) return;
      const userData = await getUserByUid(user.uid);
      if (!userData || userData.group_id !== DEFAULT_GROUP_ID) return;
      dispatch({
        type: 'setUidClient',
        payload: { ...state, uidClient: userData.uid },
      });
    }
    setUidClient();
  }, [user]);

  console.log(state);

  return {
    state,
    dispatch,
  };
}
