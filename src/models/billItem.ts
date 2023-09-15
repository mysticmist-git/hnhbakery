import WithCreatedUpdated from "./created_updated";

/**
 * Bill item which belongs to a bill
 */
type BillItem = WithCreatedUpdated & {
  id: string;
  price: number;
  amount: number
  discount: number
  total_price: number;
  total_discount: number;
  final_price: number;
  batch_id: string;
  bill_id: string;
}

export default BillItem;
