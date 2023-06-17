import BaseObject from '../models/BaseObject';

export default interface RowModalAssemblyDataStrategy {
  execute(data: BaseObject): Promise<BaseObject>;
}

export class ProductTypeRowModalAssemblyDataStrategy
  implements RowModalAssemblyDataStrategy
{
  execute(data: BaseObject): Promise<BaseObject> {
    throw new Error('Method not implemented.');
  }
}

export class ProductRowModalAssemblyDataStrategy
  implements RowModalAssemblyDataStrategy
{
  execute(data: BaseObject): Promise<BaseObject> {
    throw new Error('Method not implemented.');
  }
}

export class BatchRowModalAssemblyDataStrategy
  implements RowModalAssemblyDataStrategy
{
  execute(data: BaseObject): Promise<BaseObject> {
    throw new Error('Method not implemented.');
  }
}
