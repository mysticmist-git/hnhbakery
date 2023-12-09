import { BillTableRow } from '@/models/bill';
import React, { useEffect } from 'react';
import { getDownloadUrlFromFirebaseStorage } from '../firestore';

export async function useBillTableRow(
  bill: BillTableRow
): Promise<BillTableRow | undefined> {
  let bookingImages: string[] = [];
  let cakeBaseImage: string = '';
  if (bill.bookingItem) {
    if (bill.bookingItem.images && bill.bookingItem.images.length > 0) {
      try {
        await Promise.all(
          bill.bookingItem.images.map(
            async (image) => await getDownloadUrlFromFirebaseStorage(image)
          )
        ).then((images) => {
          bookingImages = images;
        });
      } catch (error: any) {
        console.log(error);
      }
    }

    if (bill.bookingItem.cakeBase && bill.bookingItem.cakeBase.image != '') {
      try {
        const image = await getDownloadUrlFromFirebaseStorage(
          bill.bookingItem.cakeBase.image
        );
        cakeBaseImage = image;
      } catch (error: any) {
        console.log(error);
      }
    }
  }

  return {
    ...bill,
    bookingItem: bill.bookingItem
      ? {
          ...bill.bookingItem,
          images: bookingImages,
          cakeBase: bill.bookingItem.cakeBase
            ? {
                ...bill.bookingItem.cakeBase,
                image: cakeBaseImage,
              }
            : undefined,
        }
      : undefined,
  };
}
