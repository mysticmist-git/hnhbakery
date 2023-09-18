import { db } from '@/firebase/config';
import Feedback, { feedbackConverter } from '@/models/feedback';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';

async function getFeedbacks() {
  try {
    const collectionRef = collection(
      db,
      COLLECTION_NAME.FEEDBACKS
    ).withConverter(feedbackConverter);

    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

async function getFeedbackById(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.FEEDBACKS, id).withConverter(
      feedbackConverter
    );

    const snapshot = await getDoc(docRef);

    return snapshot.data();
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}

async function updateFeedback(id: string, data: Feedback) {
  try {
    const docRef = doc(db, COLLECTION_NAME.FEEDBACKS, id).withConverter(
      feedbackConverter
    );

    await updateDoc(docRef, data);
  } catch (error) {
    console.log('[DAO] Fail to update doc', error);
  }
}

async function createFeedback(data: Feedback) {
  try {
    await addDoc(collection(db, COLLECTION_NAME.FEEDBACKS), data);
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

async function deleteFeedback(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.FEEDBACKS, id).withConverter(
      feedbackConverter
    );

    await deleteDoc(docRef);
  } catch (error) {
    console.log('[DAO] Fail to delete doc', error);
  }
}

export {
  createFeedback,
  deleteFeedback,
  getFeedbackById,
  getFeedbacks,
  updateFeedback,
};
