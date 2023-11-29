import { AssembledCartItem } from '@/@types/cart';
import { DeliveryForm } from '@/lib/hooks/useDeliveryForm';
import { FormValidationResult } from '@/lib/types/payment';
import BillItem from '@/models/billItem';
import Delivery from '@/models/delivery';

export function createDeliveryData(form: DeliveryForm): Partial<Delivery> {
  const deliveryData: Partial<Delivery> = {
    name: form.customerName,
    tel: form.tel,
    mail: form.email,
    address: form.address,
    delivery_note: form.note,
    state: 'issued',
    ship_time: form.deliveryTime,
    ship_date: form.deliveryDate,
    created_at: new Date(),
    updated_at: new Date(),
  };

  return deliveryData;
}

export const createBillItemData = (
  cartItem: AssembledCartItem,
  billId: string
): Omit<BillItem, 'id'> => {
  const price = cartItem.variant?.price ?? 0;
  const discountPercent = cartItem.batch?.discount.percent ?? 0;

  const totalPrice = price * cartItem.quantity;
  const totalDiscount = price * (discountPercent / 100) * cartItem.quantity;

  const billItemData: Omit<BillItem, 'id'> = {
    bill_id: billId,
    batch_id: cartItem.batchId,
    amount: cartItem.quantity,
    discount: discountPercent,
    price: totalPrice,
    total_price: totalPrice,
    total_discount: totalDiscount,
    final_price: price - totalDiscount,
    created_at: new Date(),
    updated_at: new Date(),
  };

  return billItemData;
};

export const sendPaymentRequestToVNPay = async (reqData: {
  billId: string;
  totalPrice: number;
  paymentDescription: string;
}) => {
  try {
    const response: Response = await fetch('/api/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqData),
    });

    const data = await response.json();

    if (data) {
      return data;
    } else {
      throw new Error('Something went wrong');
    }
  } catch (error) {
    console.log(error);
  }
};

export const mapProductBillToBillDetailObject = (
  productBill: AssembledCartItem[],
  billId: string
): Omit<BillItem, 'id'>[] => {
  return productBill.map((item) => {
    return createBillItemData(item, billId);
  });
};

export const validateForm = (form: DeliveryForm): FormValidationResult => {
  if (form?.customerName === '') {
    return {
      isValid: false,
      msg: 'Vui lòng nhập họ tên',
    };
  }

  if (form?.tel === '') {
    return {
      msg: 'Vui lòng nhập số điện thoại',
      isValid: false,
    };
  }

  if (form?.address === '') {
    return {
      msg: 'Vui lòng nhập địa chỉ',
      isValid: false,
    };
  }

  if (form?.email === '') {
    return {
      msg: 'Vui lòng nhập email',
      isValid: false,
    };
  }

  if (!form?.deliveryDate) {
    return {
      msg: 'Vui lòng chọn ngày giao',
      isValid: false,
    };
  }

  if (form?.deliveryTime === '') {
    return {
      msg: 'Vui lòng chọn thời gian giao',
      isValid: false,
    };
  }

  if (form?.branchId === '') {
    return {
      msg: 'Vui lòng chọn chi nhánh',
      isValid: false,
    };
  }

  return {
    isValid: true,
    msg: '',
  };
};
