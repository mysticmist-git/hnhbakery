import Batch from './batch';
import { BillTableRow } from './bill';
import PaymentMethod from './paymentMethod';
import { ProductTypeTableRow } from './productType';
import Sale from './sale';

type ReportTableRow = {
  productTypes?: ProductTypeTableRow[];
  bills?: BillTableRow[];
  batches?: Batch[];
  sales?: Sale[];
  paymentMethods?: PaymentMethod[];
};

export default ReportTableRow;
