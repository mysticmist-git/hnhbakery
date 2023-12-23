import { auth } from '@/firebase/config';
import { createContext, useEffect, useReducer, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getUserByUid } from '../DAO/userDAO';
import { DEFAULT_GROUP_ID, HNH_BAKERY_UID } from '../DAO/groupDAO';

export type ChatContextType = {
  canChat: boolean;
  open: boolean;
  //
  uidClient: string;
  clientName: string;
  uidStaff: string;
  staffName: string;
  combileId: string;
};

export interface ChatAction {
  type: 'setCanChat' | 'setOpen' | 'setUidClient';
  payload: ChatContextType;
}

const INITIAL_STATE: ChatContextType = {
  canChat: false,
  open: false,
  //
  uidClient: '',
  clientName: '',
  uidStaff: HNH_BAKERY_UID,
  staffName: 'H&H Bakery',
  combileId: '',
};

export const ChatContext = createContext<{
  state: ChatContextType;
  dispatch: React.Dispatch<ChatAction>;
}>({
  state: {
    ...INITIAL_STATE,
  },
  dispatch: () => {},
});

export function initChatContext() {
  const chatReducer = (
    state: ChatContextType,
    action: ChatAction
  ): ChatContextType => {
    switch (action.type) {
      case 'setCanChat':
        return {
          ...action.payload,
          canChat: action.payload.canChat,
        };
      case 'setOpen':
        return {
          ...action.payload,
          open: action.payload.open,
        };
      case 'setUidClient':
        let combileId = '';
        if (action.payload.uidClient != '' && action.payload.uidStaff != '') {
          combileId =
            action.payload.uidClient < action.payload.uidStaff
              ? action.payload.uidClient + '_' + action.payload.uidStaff
              : action.payload.uidStaff + '_' + action.payload.uidClient;
        }
        return {
          ...action.payload,
          uidClient: action.payload.uidClient,
          combileId: combileId,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  const [user, userLoading, userError] = useAuthState(auth);

  useEffect(() => {
    if (!user) return;
    async function setUidClient() {
      if (!user) return;
      const userData = await getUserByUid(user.uid);
      if (!userData) return;
      if (userData.group_id !== DEFAULT_GROUP_ID) {
        dispatch({ type: 'setCanChat', payload: { ...state, canChat: false } });
        return;
      }
      dispatch({
        type: 'setUidClient',
        payload: {
          ...state,
          uidClient: userData.uid,
          clientName: userData.name,
          canChat: true,
        },
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
