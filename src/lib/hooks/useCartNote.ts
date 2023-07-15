import { useLocalStorageValue } from '@react-hookz/web';
import { NextState } from '@react-hookz/web/cjs/util/resolveHookState';
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { NOTE_KEY } from '../constants';

function useCartNote(
  init: string = ''
): [string | undefined, (val: NextState<string, string | undefined>) => void] {
  const { value: note, set: setNote } = useLocalStorageValue<string>(NOTE_KEY, {
    defaultValue: '',
    initializeWithValue: false,
  });

  return [note, setNote];
}

export default useCartNote;
