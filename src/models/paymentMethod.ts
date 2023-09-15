import WithActive from "./withActive";

/**
 * Payment method
 */
type PaymentMethod = WithActive & {
  id: string;
  name: string;
  code: string;
  image: string;
}

export default PaymentMethod;
