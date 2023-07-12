import { AssembledCartItem } from '@/@types/cart';

interface AssembledCartItemDirector {
  build(): AssembledCartItem;
}

export default AssembledCartItemDirector;
