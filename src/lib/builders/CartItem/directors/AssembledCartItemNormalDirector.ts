import { AssembledCartItemDirector } from '.';
import AssembledCartItemBuilder from '../builders/AssembledCartItemBuilder';

class AssembledCartItemNormalDirector implements AssembledCartItemDirector {
  private _builder: AssembledCartItemBuilder;

  constructor(builder: AssembledCartItemBuilder) {
    this._builder = builder;
  }
  setBuilder(builder: AssembledCartItemBuilder): void {
    this._builder = builder;
  }

  get builder(): AssembledCartItemBuilder {
    return this._builder;
  }

  async directBuild(): Promise<void> {
    let builder = await this._builder.fetchBatch();
    builder = await builder?.fetchProduct();
    builder = await builder?.fetchVariant();
    builder = await builder?.checkDiscount();
  }
}

export default AssembledCartItemNormalDirector;
