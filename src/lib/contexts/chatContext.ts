import { auth } from '@/firebase/config';
import { createContext, useEffect, useReducer, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getUserByUid } from '../DAO/userDAO';
import { DEFAULT_GROUP_ID, HNH_BAKERY_UID } from '../DAO/groupDAO';

export type ChatContextType = {
  canChat: boolean;
  open: boolean;
  //
  uidSender: string;
  senderName: string;
  uidReceiver: string;
  receiverName: string;
  combileId: string;
  senderType: 'client' | 'staff' | '';
};

export interface ChatAction {
  type: 'setCanChat' | 'setOpen' | 'setUidSender' | 'setUidReceiver';
  payload: ChatContextType;
}

const INITIAL_STATE: ChatContextType = {
  canChat: false,
  open: false,
  //
  uidSender: '',
  senderName: '',
  uidReceiver: HNH_BAKERY_UID,
  receiverName: 'H&H Bakery',
  combileId: '',
  senderType: '',
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
      case 'setUidSender': {
        let combileId = '';
        if (
          action.payload.uidSender != '' &&
          action.payload.uidReceiver != ''
        ) {
          combileId =
            action.payload.uidSender < action.payload.uidReceiver
              ? action.payload.uidSender + '_' + action.payload.uidReceiver
              : action.payload.uidReceiver + '_' + action.payload.uidSender;
        }
        return {
          ...action.payload,
          uidSender: action.payload.uidSender,
          combileId: combileId,
        };
      }
      case 'setUidReceiver': {
        let combileId = '';
        if (
          action.payload.uidSender != '' &&
          action.payload.uidReceiver != ''
        ) {
          combileId =
            action.payload.uidSender < action.payload.uidReceiver
              ? action.payload.uidSender + '_' + action.payload.uidReceiver
              : action.payload.uidReceiver + '_' + action.payload.uidSender;
        }

        return {
          ...action.payload,
          uidReceiver: action.payload.uidReceiver,
          receiverName: action.payload.receiverName,
          combileId: combileId,
        };
      }
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  const [user, userLoading, userError] = useAuthState(auth);

  useEffect(() => {
    if (!user) return;
    async function setUidSender() {
      if (!user) return;
      const userData = await getUserByUid(user.uid);
      if (!userData) return;
      if (userData.group_id !== DEFAULT_GROUP_ID) {
        dispatch({
          type: 'setCanChat',
          payload: {
            ...state,
            uidSender: HNH_BAKERY_UID,
            senderName: 'H&H Bakery',
            uidReceiver: '',
            receiverName: 'Vui bạn chọn khách hàng',
            canChat: true,
            senderType: 'staff',
          },
        });
        return;
      }
      dispatch({
        type: 'setUidSender',
        payload: {
          ...state,
          uidSender: userData.uid,
          senderName: userData.name,
          uidReceiver: HNH_BAKERY_UID,
          receiverName: 'H&H Bakery',
          canChat: true,
          senderType: 'client',
        },
      });
    }
    setUidSender();
  }, [user]);

  console.log(state);

  return {
    state,
    dispatch,
  };
}
