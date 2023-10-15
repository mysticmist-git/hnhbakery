import { useSnackbarService } from '@/lib/contexts';
import { formatPrice } from '@/lib/utils';
import { ContentCopyRounded } from '@mui/icons-material';
import { InputAdornment, Tooltip, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CustomIconButton } from '../../buttons';
import Outlined_TextField from '../../order/MyModal/Outlined_TextField';
import { SanPhamDoanhThuType } from '@/pages/manager/reports';

export default function SanPhamDoanhThu({
  spDoanhThu,
  spDoanhThuSearch,
}: {
  spDoanhThu: SanPhamDoanhThuType[];
  spDoanhThuSearch: string;
}) {
  const theme = useTheme();
  const textStyle = {
    fontSize: theme.typography.body2.fontSize,
    color: theme.palette.common.black,
    fontWeight: theme.typography.body2.fontWeight,
    fontFamily: theme.typography.body2.fontFamily,
  };

  const [data, setData] = useState(spDoanhThu);

  useEffect(() => {
    setData(() => spDoanhThu);
  }, [spDoanhThu]);

  const getValue = (item: SanPhamDoanhThuType) => {
    var result = '';
    result += 'Mã lô: ' + item.id;
    result += '\nMã sản phẩm: ' + item.product.id;
    result += '\nĐã bán: ' + item.sold;
    result += '\nDoanh thu: ' + formatPrice(item.revenue);
    result += '\nChiểm tỉ lệ: ' + item.percentage + '%';
    result +=
      '\nTrạng thái: ' +
      (item.product.active ? 'Còn sản xuất' : 'Ngưng sản xuất');

    return result;
  };

  const getLabel = (item: SanPhamDoanhThuType) => {
    const variant = item.product?.variants?.find(
      (variant) => variant.id === item.variant_id
    );
    return (
      item.product.name +
      ' - ' +
      variant?.material +
      ' - Size: ' +
      variant?.size
    );
  };
  const handleSnackbarAlert = useSnackbarService();

  return (
    <>
      {data.map((item, index) => {
        return (
          <Outlined_TextField
            key={index}
            multiline
            textStyle={textStyle}
            label={getLabel(item)}
            value={getValue(item)}
            sx={{
              display:
                spDoanhThuSearch.trim() === '' ||
                getValue(item)
                  .toLocaleLowerCase()
                  .includes(spDoanhThuSearch.toLocaleLowerCase()) ||
                getLabel(item)
                  .toLocaleLowerCase()
                  .includes(spDoanhThuSearch.toLocaleLowerCase())
                  ? 'block'
                  : 'none',
            }}
            InputProps={{
              readOnly: true,
              style: {
                pointerEvents: 'auto',
                borderRadius: '8px',
              },
              endAdornment: item.product.id && (
                <InputAdornment position="end">
                  <CustomIconButton
                    edge="end"
                    onClick={() => {
                      navigator.clipboard.writeText(item.product.id ?? 'Trống');
                      handleSnackbarAlert(
                        'success',
                        'Đã sao chép mã sản phẩm vào clipboard!'
                      );
                    }}
                  >
                    <Tooltip title="Sao chép mã sản phẩm vào clipboard">
                      <ContentCopyRounded fontSize="small" />
                    </Tooltip>
                  </CustomIconButton>
                </InputAdornment>
              ),
            }}
          />
        );
      })}

      {data.length <= 0 && (
        <Typography
          variant="body2"
          color={theme.palette.text.secondary}
          align="center"
        >
          Trống
        </Typography>
      )}
    </>
  );
}
