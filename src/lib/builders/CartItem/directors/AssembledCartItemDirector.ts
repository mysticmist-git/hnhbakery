import { AssembledCartItem } from '@/@types/cart';
import { AssembledCartItemDirector } from '.';
import AssembledCartItemBuilder from '../builders/AssembledCartItemBuilder';

class AssembledCartItemNormalDirector implements AssembledCartItemDirector {
  private _builder: AssembledCartItemBuilder;

  constructor(builder: AssembledCartItemBuilder) {
    this._builder = builder;
  }

  build(): AssembledCartItem {
    this._builder.fetchBatch();
    this._builder.checkDiscount();
    this._builder.fetchProduct();
    this._builder.fetchVariant();

    return this._builder.build();
  }
}

export default AssembledCartItemNormalDirector;
