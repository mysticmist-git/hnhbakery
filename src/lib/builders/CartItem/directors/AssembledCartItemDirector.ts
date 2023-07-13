import { AssembledCartItem } from '@/@types/cart';
import { AssembledCartItemDirector } from '.';
import AssembledCartItemBuilder from '../builders/AssembledCartItemBuilder';

class AssembledCartItemNormalDirector implements AssembledCartItemDirector {
  private _builder: AssembledCartItemBuilder;

  constructor(builder: AssembledCartItemBuilder) {
    this._builder = builder;
  }

  async directBuild(): Promise<void> {
    let builder = null;
    builder = await this._builder.fetchBatch();
    builder = await builder?.checkDiscount();
    builder = await builder?.fetchProduct();
    builder = await builder?.fetchVariant();
  }
}

export default AssembledCartItemNormalDirector;
