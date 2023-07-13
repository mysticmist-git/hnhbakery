import AssembledCartItemBuilder from '../builders/AssembledCartItemBuilder';
import AssembledCartItemDirector from './AssembledCartItemInterface';

class AssembledCartItemNormalDirector implements AssembledCartItemDirector {
  private _builder: AssembledCartItemBuilder;

  constructor(builder: AssembledCartItemBuilder) {
    this._builder = builder;
  }

  setBuilder(builder: AssembledCartItemBuilder): void {
    this._builder = builder;
  }

  async directBuild(): Promise<void> {
    await (
      await (
        await (await this._builder.fetchBatch()).checkDiscount()
      ).fetchProduct()
    ).fetchVariant();
  }

  public get builder(): AssembledCartItemBuilder {
    return this._builder;
  }
}

export default AssembledCartItemNormalDirector;
