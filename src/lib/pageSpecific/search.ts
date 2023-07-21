import { COLLECTION_NAME, ROUTES } from '@/lib/constants';
import { getCollectionWithQuery, getDocFromFirestore } from '@/lib/firestore';
import {
  BatchObject,
  BillDetailObject,
  BillObject,
  PaymentObject,
  ProductObject,
  SaleObject,
} from '@/lib/models';
import { BillDetail, BillInfor, ProductInfor } from '@/lib/types/search';
import { formatDateString } from '@/lib/utils';
import { where } from 'firebase/firestore';

export const createSearchResult = async (
  billId: string
): Promise<{ billInfor: BillInfor; productInfors: ProductInfor[] }> => {
  try {
    const bill = await getDocFromFirestore<BillObject>(
      COLLECTION_NAME.BILLS,
      billId
    );

    const payment = await getDocFromFirestore<PaymentObject>(
      COLLECTION_NAME.PAYMENTS,
      bill.payment_id
    );

    let sale: SaleObject | null = null;

    try {
      sale = await getDocFromFirestore<SaleObject>(
        COLLECTION_NAME.SALES,
        bill.sale_id
      );
    } catch (error) {
      console.log(error);
    }

    const billInfor: BillInfor = {
      billDetail: {
        bill_Id: bill.id!,
        bill_State: bill.state,
        bill_HinhThucThanhToan: payment.name,
        bill_PaymentTime: formatDateString(bill.paymentTime ?? new Date()),
        bill_Note: bill.note,
        bill_TongTien: bill.originalPrice,
        bill_KhuyenMai: bill.saleAmount,
        bill_ThanhTien: bill.totalPrice,
      },
      saleDetail: sale
        ? {
            sale_Id: sale.id!,
            sale_Name: sale.name,
            sale_Code: sale.code,
            sale_Percent: sale.percent,
            sale_MaxSalePrice: sale.maxSalePrice,
            sale_Description: sale.description,
            sale_StartAt: formatDateString(sale.start_at ?? new Date()),
            sale_EndAt: formatDateString(sale.end_at ?? new Date()),
            sale_Image: sale.image,
          }
        : undefined,
    };

    const billDetails = await getCollectionWithQuery<BillDetailObject>(
      COLLECTION_NAME.BILL_DETAILS,
      where('bill_id', '==', billId)
    );

    const productInfors: ProductInfor[] = [];

    for (const billDetail of billDetails) {
      const batch = await getDocFromFirestore<BatchObject>(
        COLLECTION_NAME.BATCHES,
        billDetail.batch_id
      );

      const product = await getDocFromFirestore<ProductObject>(
        COLLECTION_NAME.PRODUCTS,
        batch.product_id
      );

      const variant = product.variants.find((v) => v.id === batch.variant_id);

      const type = await getDocFromFirestore<ProductObject>(
        COLLECTION_NAME.PRODUCT_TYPES,
        product.productType_id
      );

      const info: ProductInfor = {
        bill_ProductDetail: {
          amount: billDetail.amount,
          price: billDetail.price,
          discount: billDetail.discount,
          discountPrice: billDetail.price - billDetail.discountAmount,
          MFG: formatDateString(batch.MFG),
          EXP: formatDateString(batch.EXP),
          size: variant?.size ?? '',
          material: variant?.material ?? '',
        },
        productDetail: {
          name: product.name,
          image: product.images[0] ?? '',
          price: variant?.price ?? 0,
          type: type.name,
          state: product.isActive ? 1 : 0,
          description: product.description,
          href: `${ROUTES.PRODUCT_DETAIL}?id=${product.id}`,
        },
      };

      productInfors.push(info);
    }

    return { billInfor, productInfors };
  } catch (error) {
    console.log(error);
    return {
      billInfor: {} as BillInfor,
      productInfors: [],
    };
  }
};
