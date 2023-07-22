import { AssembledCartItem } from '@/@types/cart';
import { DeliveryForm } from '@/lib/hooks/useDeliveryForm';
import { BillDetailObject, DeliveryObject } from '@/lib/models';
import { FormValidationResult } from '@/lib/types/payment';

export function createDeliveryData(
  form: DeliveryForm,
  billId: string,
  price: number
) {
  const date = form.deliveryDate;
  const time = form.deliveryTime;

  const deliveryData: DeliveryObject = {
    name: form.customerName,
    tel: form.tel,
    email: form.email,
    address: form.address,
    note: form.note,
    date: date,
    time: time,
    bill_id: billId,
    state: 'inProcress',
  };

  return deliveryData;
}

export const createBillDetailData = (
  cartItem: AssembledCartItem,
  billId: string
): BillDetailObject => {
  const billDetailData: BillDetailObject = {
    amount: cartItem.quantity,
    price: cartItem.variant?.price,
    discount: cartItem.batch?.discount.percent,
    discountAmount: cartItem.discountAmount,
    batch_id: cartItem.batchId,
    bill_id: billId,
  } as BillDetailObject;

  return billDetailData;
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
) => {
  return productBill.map((item) => {
    return createBillDetailData(item, billId);
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

  return {
    isValid: true,
    msg: '',
  };
};

export function calculateTotalBillPrice(
  productPrice: number,
  saleAmount: number,
  shippingFee: number
) {
  return productPrice - saleAmount + shippingFee;
}
