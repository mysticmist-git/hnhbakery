import { useMemo, useState } from 'react';
import { MocGioGiaoHang } from '../constants';

const DeliveryFormField = {
  CUSTOMER_NAME: 'CUSTOMER_NAME',
  TEL: 'TEL',
  EMAIL: 'EMAIL',
  ADDRESS: 'ADDRESS',
  DELIVERY_DATE: 'DELIVERY_DATE',
  DELIVERY_TIME: 'DELIVERY_TIME',
  NOTE: 'NOTE',
} as const;

export type DeliveryFormField = keyof typeof DeliveryFormField;

export type DeliveryForm = {
  customerName: string;
  tel: string;
  email: string;
  address: string;
  deliveryDate: Date;
  deliveryTime: string;
  note: string;
};

export type SetDeliveryForm = (
  field: DeliveryFormField,
  value: DeliveryForm[keyof DeliveryForm]
) => void;

function useDeliveryForm(): [DeliveryForm, SetDeliveryForm] {
  const [customerName, setCustomerName] = useState('');
  const [tel, setTel] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<Date>(new Date());
  const [deliveryTime, setDeliveryTime] = useState(MocGioGiaoHang[0].value);
  const [note, setNote] = useState('');

  function handleFieldChange(
    field: DeliveryFormField,
    value: DeliveryForm[keyof DeliveryForm]
  ) {
    switch (field) {
      case 'CUSTOMER_NAME':
        if (typeof value === 'string') setCustomerName(value);
        break;
      case 'TEL':
        if (typeof value === 'string') setTel(value);
        break;
      case 'EMAIL':
        if (typeof value === 'string') setEmail(value);
        break;
      case 'ADDRESS':
        if (typeof value === 'string') setAddress(value);
        break;
      case 'DELIVERY_DATE':
        setDeliveryDate(new Date(value));
        break;
      case 'DELIVERY_TIME':
        if (typeof value === 'string') setDeliveryTime(value);
        break;
      case 'NOTE':
        if (typeof value === 'string') setNote(value);
        break;
    }
  }

  const form = useMemo(
    (): DeliveryForm => ({
      customerName,
      tel,
      email,
      address,
      deliveryDate,
      deliveryTime,
      note,
    }),
    [customerName, tel, email, address, deliveryDate, deliveryTime, note]
  );

  return [form, handleFieldChange];
}

export default useDeliveryForm;
