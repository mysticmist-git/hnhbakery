import { useBillTableRow } from '@/lib/hooks/useBillTableRow';
import { BillTableRow } from '@/models/bill';
import { Box, Button } from '@mui/material';
import React, { useRef } from 'react';

function email() {
  const ref = useRef<HTMLDivElement>(null);
  const bill: BillTableRow = {
    paid_time: new Date('2023-12-01T06:37:57.543Z'),
    created_at: new Date('2023-12-01T06:37:57.543Z'),
    total_price: 0,
    id: 'mn52HuUp4fw3u7mQp4QS',
    bookingItem: {
      occasion: 'Sinh nhật',
      size: 'NHỎ',
      note: '',
      images: [
        'bookingImages/mn52HuUp4fw3u7mQp4QS_0',
        'bookingImages/mn52HuUp4fw3u7mQp4QS_1',
        'bookingImages/mn52HuUp4fw3u7mQp4QS_2',
        'bookingImages/mn52HuUp4fw3u7mQp4QS_3',
      ],
      cake_base_id: '2',
      message: {
        color: '#F43545',
        content: 'dui',
      },
      id: 'UmiJ5XWO3XIz2EKOtITb',
      cakeBase: {
        id: '2',
        name: 'Cốt bánh chocolate',
        description: 'Cốt bánh chocolate thường đậm đà và có màu nâu sôcôla.',
        image: 'cakeBases/2.jpg',
      },
    },
    updated_at: new Date('2023-12-01T06:37:57.543Z'),
    delivery_id: 'V05cdsl4XOAwpzfa51kd',
    branch: {
      id: '1',
      created_at: new Date('2023-10-16T13:10:30.135Z'),
      group_id: 'vn01AtyWFcteKd4OJsCa',
      province_id: '4NLfSB5IRPv6JihoPVty',
      active: true,
      name: 'H&H Hà Nội',
      manager_id: 'Hhs5gXkm5jTPf44itD0y',
      updated_at: new Date('2023-10-16T13:10:42.863Z'),
      address: 'Số nhà 42, ngõ 17, đường Trần Duy Hưng, quận Cầu Giấy, Hà Nội.',
    },
    total_discount: 0,
    customer_id: '1LAnHa9LFNJ0EFExZR6q',
    branch_id: '1',
    booking_item_id: 'UmiJ5XWO3XIz2EKOtITb',
    payment_method_id: 'cash',
    note: '',
    sale_price: 0,
    sale_id: '',
    state: 'paid',
    final_price: 100000,
    paymentMethod: {
      id: 'cash',
      name: 'Tiền mặt',
      code: 'cash',
      active: true,
      image: 'paymentMethods/cash.jpg',
    },
    customer: {
      avatar: '',
      tel: '0343214971',
      mail: 'phantruonghuy0701@gmail.com',
      birth: new Date('1990-01-31T17:00:00.000Z'),
      group_id: 'default',
      type: 'google',
      uid: '3Kelzi2xkwRiknCpMHQCeQTZmFg2',
      active: true,
      name: 'Trường Huy Phan',
      created_at: new Date('2023-09-27T12:51:26.400Z'),
      updated_at: new Date('2023-09-27T12:51:26.400Z'),
      id: '1LAnHa9LFNJ0EFExZR6q',
    },
    deliveryTableRow: {
      created_at: new Date('2023-12-01T06:37:56.662Z'),
      end_at: new Date('2023-12-01T06:37:56.662Z'),
      name: 'Phan Trường Huy',
      updated_at: new Date('2023-12-01T06:37:56.662Z'),
      shipper_id: '',
      mail: 'phantruonghuy0701@gmail.com',
      start_at: new Date('2023-12-01T06:37:56.662Z'),
      tel: '0343214971',
      ship_date: new Date('2023-12-01T06:37:47.132Z'),
      state: 'delivered',
      id: 'V05cdsl4XOAwpzfa51kd',
      cancel_note: '',
      delivery_note: '',
      ship_time: 'Buổi sáng (07:30 - 11:30)',
      address: '195 Tân Lập, Đông Hoà, Thủ Đức, Bình Dương 700000, Việt Nam',
      image: '',
    },
    billItems: [],
  };
  return (
    <>
      <Button
        sx={{ my: 24 }}
        variant="contained"
        onClick={async () => {
          const data = await useBillTableRow(bill);
          console.log(data);

          await fetch('/api/sendBillToEmail', {
            method: 'POST',
            body: JSON.stringify({
              bill: data,
            }),
          })
            .then((response) => response.json())
            .then((json) => console.log(json));
        }}
      >
        Gửi
      </Button>

      <Box ref={ref} component={'div'}>
        <Box component={'div'} sx={{ backgroundColor: 'red', p: 3 }}>
          huy
        </Box>
      </Box>
    </>
  );
}

export default email;
