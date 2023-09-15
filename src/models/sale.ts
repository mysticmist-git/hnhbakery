import WithCreatedUpdated from "./created_updated";
import WithActive from "./withActive";

/**
 * Sale which come with some discount
 */
type Sale = WithCreatedUpdated & WithActive & {
  id: string;
  name: string;
  code: string;
  description: string;
  percent: number;
  limit: number;
  image: string;
  start_at: Date;
  end_at: Date;
}

export default Sale;
