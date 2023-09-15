import WithCreatedUpdated from "./created_updated";

type DeliveryState = 'issued' | 'delivering' | 'delivered' | 'cancelled'

/**
 * Stores data of a delivery
 */
type Delivery = WithCreatedUpdated & {
  id: string;
  name: string;
  tel: string;
  mail: string;
  address: string;
  delivery_note: string;
  cancel_note: string;
  image: string;
  start_at: Date;
  end_at: Date;
  bill_id: string;
  state: DeliveryState;
  shipper: string; // the id of the shipper
}

export default Delivery;
