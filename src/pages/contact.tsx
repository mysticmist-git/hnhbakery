import ContactForm from '@/components/Contact/ContactForm';
import ContactWrapper from '@/components/Contact/ContactWrapper';
import React, { memo, useMemo } from 'react';

const Contact = () => {
  const wrapperTitle = useMemo(
    () =>
      'Cảm ơn bạn đã ghé thăm trang web của tiệm bánh và sử dụng form đóng góp / liên hệ của chúng tôi. Chúng tôi rất trân trọng ý kiến đóng góp của bạn và sẽ liên hệ lại với bạn trong thời gian sớm nhất có thể. Xin cảm ơn!',
    [],
  );

  return (
    <ContactWrapper title={wrapperTitle}>
      <ContactForm />
    </ContactWrapper>
  );
};

export default memo(Contact);
