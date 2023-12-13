import { BillTableRow } from '@/models/bill';
import React, { useEffect } from 'react';
import { getDownloadUrlFromFirebaseStorage } from '../firestore';
import { BillItemTableRow } from '@/models/billItem';

export async function useBillTableRow(
  bill: BillTableRow
): Promise<BillTableRow | undefined> {
  let bookingImages: string[] = [];
  let cakeBaseImage: string = '';
  let productBillItems: BillItemTableRow[] = [];
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
  if (bill.billItems && bill.billItems.length > 0) {
    try {
      await Promise.all(
        bill.billItems.map(async (item) => {
          if (
            item.product &&
            item.product.images.length > 0 &&
            item.product.images[0] != ''
          ) {
            const image = await getDownloadUrlFromFirebaseStorage(
              item.product.images[0]
            );

            item.product.images[0] = image;
          }
          return item;
        })
      ).then((billItems) => {
        productBillItems = billItems;
      });
    } catch (error: any) {
      console.log(error);
    }
  }

  return {
    ...bill,
    billItems: productBillItems,
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
