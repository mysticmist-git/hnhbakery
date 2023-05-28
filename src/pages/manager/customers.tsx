import React, { useEffect, useState } from 'react';

const Customer = () => {
  const [text, setText] = useState('')

  useEffect(() => {
    setText(() => 'Hello customer')
  }, [])

  return <div>{text}</div>;
};

export default Customer;
