import WithCreatedUpdated from "./created_updated";
import WithActive from "./withActive";

/**
 * User Group
 * Available Collection: users {User}
 */
type Group = WithCreatedUpdated & WithActive & {
  id: string;
  name: string;
  permissions: string[];
}

export default Group;
