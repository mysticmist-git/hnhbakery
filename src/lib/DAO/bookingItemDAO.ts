import { db } from '@/firebase/config';
import { COLLECTION_NAME } from '../constants';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import BookingItem, { bookingItemConverter } from '@/models/bookingItem';

export function getBookingItemsRef() {
  return collection(db, COLLECTION_NAME.BOOKING_ITEMS).withConverter(
    bookingItemConverter
  );
}

export function getBookingItemRefById(id: string) {
  return doc(getBookingItemsRef(), id).withConverter(bookingItemConverter);
}

export async function getBookingItemSnapshot() {
  return await getDocs(getBookingItemsRef());
}

export async function getBookingItemSnapshotById(id: string) {
  return await getDoc(getBookingItemRefById(id));
}

export async function getBookingItems() {
  return (await getBookingItemSnapshot()).docs.map((doc) => doc.data());
}

export async function getBookingItemById(id: string) {
  return (await getBookingItemSnapshotById(id)).data();
}

export async function updateBookingItem(
  id: string,
  data: Omit<BookingItem, 'id'>
) {
  await updateDoc(getBookingItemRefById(id), data);
}

export async function createBookingItem(data: Omit<BookingItem, 'id'>) {
  return await addDoc(getBookingItemsRef(), data);
}

export async function deleteBookingItem(id: string) {
  await deleteDoc(getBookingItemRefById(id));
}
