import { useEffect, useState } from 'react';
import { PLACEHOLDER_DELIVERY_PRICE } from '../constants';

// TODO: please fix this
function useShippingFee(): number {
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    async function execute() {
      setShippingFee(PLACEHOLDER_DELIVERY_PRICE);
    }

    execute();
  }, []);

  return shippingFee;
}

export default useShippingFee;
