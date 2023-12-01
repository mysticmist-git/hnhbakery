import BookingItem from '@/models/bookingItem';
import { createContext, useCallback, useEffect, useState } from 'react';
import { useSnackbarService } from './snackbarService';

// #region Context
export type PaymentContextType = {
  bookingItem: BookingItem;
  imageArray: File[];
  isBooking: boolean;
  handleBookingItemChange: (key: keyof BookingItem, value: any) => void;
  handleImageArrayChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addImageArrayFromModel3D: (newFileArray: File[]) => void;
  removeImage: (index: number) => void;
  resetState: () => void;
};

export const PaymentContext = createContext<PaymentContextType>({
  bookingItem: {
    id: '',
    images: [],
    occasion: '',
    size: '',
    cake_base_id: '',
    message: {
      content: '',
      color: '',
    },
    note: '',
  },
  imageArray: [],
  isBooking: false,
  handleBookingItemChange: () => {},
  handleImageArrayChange: () => {},
  addImageArrayFromModel3D: () => {},
  removeImage: () => {},
  resetState: () => {},
});

export function initPaymentContext() {
  const handleSnackbarAlert = useSnackbarService();

  const [bookingItem, setBookingItem] = useState<BookingItem>({
    id: '',
    images: [],
    occasion: '',
    size: '',
    cake_base_id: '',
    message: {
      content: '',
      color: '',
    },
    note: '',
  });

  const handleBookingItemChange = useCallback(
    (key: keyof BookingItem, value: any) => {
      setBookingItem((prev) => {
        return {
          ...prev,
          [key]: value,
        };
      });
    },
    []
  );

  const [imageArray, setImageArray] = useState<File[]>([]);

  const [isBooking, setIsBooking] = useState(false);

  const handleImageArrayChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const array = Array.from(e.target.files);
        setImageArray((prev) => {
          return [...prev, ...array];
        });
        handleSnackbarAlert('success', 'Thêm ảnh thành công!');
      }
    },
    []
  );

  const addImageArrayFromModel3D = useCallback((newFileArray: File[]) => {
    setImageArray(newFileArray);
  }, []);

  const removeImage = useCallback((index: number) => {
    setImageArray((prev) => {
      const newImageArray = [...prev];
      newImageArray.splice(index, 1);
      return newImageArray;
    });
    handleSnackbarAlert('success', 'Xóa thành công');
  }, []);

  const resetState = useCallback(() => {
    setBookingItem({
      id: '',
      images: [],
      occasion: '',
      size: '',
      cake_base_id: '',
      message: {
        content: '',
        color: '',
      },
      note: '',
    });
    setImageArray([]);
  }, []);

  // useEffect(() => {
  //   if (imageArray.length > 0) {
  //     if (
  //       bookingItem.occasion !== '' &&
  //       bookingItem.size !== '' &&
  //       bookingItem.cake_base_id !== '' &&
  //       bookingItem.message.content !== ''
  //     ) {
  //       setIsBooking(true);
  //     } else {
  //       setIsBooking(false);
  //     }
  //   } else {
  //     setIsBooking(false);
  //   }
  // }, [bookingItem, imageArray]);

  return {
    bookingItem,
    imageArray,
    isBooking,
    handleBookingItemChange,
    handleImageArrayChange,
    addImageArrayFromModel3D,
    removeImage,
    resetState,
  } as PaymentContextType;
}

// #endregion
