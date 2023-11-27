import { useCallback, useState } from 'react';
import { MocGioGiaoHang } from '../constants';

// TODO: Refactor/Remove needed
// THIS WHOLE THING IS REDUNDANT.
// I HAVE NO IDEA WHY I'VE COME UP WITH THIS.
// PLEASE REFACTOR TO REMOVE THIS IN THE FUTURE IF YOU HAVE TIME.

export type DeliveryForm = {
  customerName: string;
  tel: string;
  email: string;
  branchId: string;
  address: string;
  deliveryDate: Date;
  deliveryTime: string;
  note: string;
};

export type DeliveryFormField = keyof DeliveryForm;

const DEFAULT_DELIVERY_FORM: DeliveryForm = {
  customerName: '',
  tel: '',
  email: '',
  branchId: '',
  address: '',
  deliveryDate: new Date(),
  deliveryTime: MocGioGiaoHang[0].value,
  note: '',
};

export type SetDeliveryForm = (
  field: DeliveryFormField,
  value: DeliveryForm[DeliveryFormField]
) => void;

function useDeliveryForm(): [DeliveryForm, SetDeliveryForm] {
  const [form, setForm] = useState<DeliveryForm>(DEFAULT_DELIVERY_FORM);

  const handleFieldChange = useCallback(
    (field: DeliveryFormField, value: DeliveryForm[keyof DeliveryForm]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return [form, handleFieldChange];
}

export default useDeliveryForm;
