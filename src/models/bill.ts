import WithCreatedUpdated from "./created_updated";

/**
 * State of a bill
 */
type State = 'issued' | 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded';

/**
 * Bill
 * Available Collection: bill_items
 */
type Bill = WithCreatedUpdated & {
  id: string;
  total_price: number;
  total_discount: number;
  sale_price: number;
  final_price: number;
  note: string;
  state: State;
  payment_method_id: string;
  sale_id: string;
  customer_id: string;
  paid_time: Date;
}

export default Bill;
