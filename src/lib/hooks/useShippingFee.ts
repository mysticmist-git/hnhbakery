import { useEffect, useState } from 'react';

// TODO: please fix this
function useShippingFee(): number {
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    async function execute() {
      setShippingFee(100000);
    }

    execute();
  }, []);

  return shippingFee;
}

export default useShippingFee;
