import WithCreatedUpdated from "./created_updated";
import WithActive from "./withActive";

/**
 * Stores data about a User
 * Available collections: addresses, bills
 */
type User = WithCreatedUpdated & WithActive & {
  id: string;
  name: string;
  tel: string;
  birth: Date;
  avatar: string;
  addresses: string[];
  group_id: string;
}

export default User;
