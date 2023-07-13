import { AssembledCartItem } from '@/@types/cart';
import { AssembledCartItemBuilder } from '../builders';

interface AssembledCartItemDirector {
  setBuilder(builder: AssembledCartItemBuilder): void;
  directBuild(): void;

  get builder(): AssembledCartItemBuilder;
}

export default AssembledCartItemDirector;
