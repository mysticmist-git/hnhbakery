import { AssembledCartItem, CartItem } from '@/@types/cart';
import { AssembledCartItemBuilder } from './builders/CartItem/builders';
import {
  AssembledCartItemDirector,
  AssembledCartItemNormalDirector,
} from './builders/CartItem/directors';
import { COLLECTION_NAME } from './constants';
import { getDocFromFirestore } from './firestore';
import { BatchObject } from './models';

export async function filterExpired(cart: CartItem[]): Promise<CartItem[]> {
  if (!cart) throw new Error('cart is null');

  const now = new Date().getTime();

  const filteredCart: CartItem[] = [];

  for (const item of cart) {
    try {
      const batch = await getDocFromFirestore<BatchObject>(
        COLLECTION_NAME.BATCHES,
        item.batchId
      );

      if (batch.EXP.getTime() > now) {
        filteredCart.push(item);
      }
    } catch (error) {
      console.log(error);
    }
  }

  console.log(filteredCart);

  return filteredCart;
}

export async function assembleItems(
  cart: CartItem[]
): Promise<AssembledCartItem[]> {
  const items = await Promise.all(
    cart?.map(async (item) => {
      const builder = new AssembledCartItemBuilder(item);
      const director: AssembledCartItemDirector =
        new AssembledCartItemNormalDirector(builder);

      await director.directBuild();

      const assembledItem = builder.build();

      return assembledItem;
    }) ?? []
  );

  return items;
}
