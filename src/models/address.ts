import WithCreatedUpdated from "./created_updated";

/**
 * An address of an user;
 */
type Address = WithCreatedUpdated & {
  id: string;
  address: string;
  user_id: string;
}

export default Address;
