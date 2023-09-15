import WithCreatedUpdated from "./created_updated";

/**
 * Contact from anonynomous user
 */
type Contact = WithCreatedUpdated & {
  id: string;
  mail: string;
  name: string;
  tel: string;
  title: string;
  content: string;
}

export default Contact;
