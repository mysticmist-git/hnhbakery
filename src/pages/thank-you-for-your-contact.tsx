import { ContactWrapper } from '@/components/Contact';
import React, { memo } from 'react';

const ThankYou = () => {
  return (
    <ContactWrapper title="Cảm ơn rất nhiều về phản hồi của bạn. Những đóng góp quý giá này sẽ giúp cải thiện chất lượng tiệm bánh rất nhiều trong tương lai." />
  );
};

export default memo(ThankYou);
