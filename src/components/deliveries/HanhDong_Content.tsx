import { useSnackbarService } from '@/lib/contexts';
import { SuperDetail_DeliveryObject } from '@/lib/models';
import { useTheme } from '@emotion/react';
import { useState } from 'react';

type EditType = {
  startAt?: Date;
  endAt?: Date;
  shipperNote?: string;
};

function ResetEditContent(delivery: SuperDetail_DeliveryObject | null) {
  return {
    startAt: delivery?.startAt ?? new Date(),
    endAt: delivery?.endAt ?? new Date(),
    shipperNote: delivery?.shipperNote ?? '',
  };
}

export function HanhDong_Content({
  textStyle,
  modalDelivery,
}: {
  textStyle: any;
  modalDelivery: SuperDetail_DeliveryObject | null;
}) {
  const theme = useTheme();
  const StyleCuaCaiBox = {
    width: '100%',
    height: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    border: 1,
    borderColor: theme.palette.text.secondary,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'center',
    opacity: 0.8,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      opacity: 1,
      boxShadow: 10,
    },
  };
  const handleSnackbarAlert = useSnackbarService();
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState<EditType | null>(
    ResetEditContent(modalDelivery)
  );

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditContent(() => ResetEditContent(modalDelivery));
    handleSnackbarAlert('info', 'Đã hủy thay đổi.');
  };

  return <></>;
}
