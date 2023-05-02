import React, { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import ProductType from '@/lib/models/ProductType';
import Home from './home';
import Products from './products';

export default function nha() {
  const [productTypes, getProductTypes] = useState<ProductType[]>([]);

  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, 'productTypes'));
  };

  getData();

  return <Home />;
}
