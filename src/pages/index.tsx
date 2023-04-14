import React, { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import ProductType from '@/lib/models/ProductType';

export default function Home() {
  const [productTypes, getProductTypes] = useState<ProductType[]>([]);

  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, 'productTypes'));
  };

  getData();

  return <div>Home</div>;
}
