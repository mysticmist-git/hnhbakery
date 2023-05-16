import { auth, provider } from '@/firebase/config';
import { signInWithPopup } from 'firebase/auth';
import router from 'next/router';

export const handleLoginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Redirect to home page after successful login
    router.push('/');
  } catch (error) {
    console.log(error);
  }
};
