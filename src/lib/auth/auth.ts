import { auth, db, provider } from '@/firebase/config';
import { UserCredential, signInWithPopup } from 'firebase/auth';
import { Timestamp, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import router from 'next/router';
import { getDocFromFirestore } from '../firestore';
import { UserObject } from '../models';
import { SignupUser } from '../types/auth';

export const addUserWithEmailAndPassword = (
  id: string,
  userData: SignupUser
) => {
  try {
    setDoc(doc(db, 'users', id), userData);
  } catch (error) {
    console.log(error);
  }
};

export const addUserWithGoogleLogin = (userCredential: UserCredential) => {
  try {
    const user = userCredential.user;

    const userData: UserObject = {
      id: user.uid,
      name: user.displayName ?? '',
      tel: user.phoneNumber ?? '',
      mail: user.email ?? '',
      accountType: 'google',
      role_id: 'customer',
    };

    setDoc(doc(db, 'users', user.uid), userData);
  } catch (error) {
    console.log(error);
  }
};

export const handleLoginWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, provider);

    try {
      const user = await getDocFromFirestore<UserObject>(
        'users',
        userCredential.user.uid
      );

      if (!user) throw new Error('No user');
    } catch (error) {
      addUserWithGoogleLogin(userCredential);
    }

    // Redirect to home page after successful login
    router.push('/');
  } catch (error) {
    console.log(error);
  }
};
